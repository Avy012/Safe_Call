require('dotenv').config();
const express = require('express');
const axios = require('axios');
const AWS = require('aws-sdk');
const path = require('path');

const app = express();
app.use(express.json());

const LIVEKIT_SERVER_URL = 'https://safecall-ozn2xsg6.livekit.cloud';
const EGRESS_JWT_TOKEN   = process.env.EGRESS_JWT_TOKEN;
const POLL_INTERVAL_MS   = 10_000;  // 5초마다 새 세그먼트 체크

// AWS S3 클라이언트
const s3 = new AWS.S3({
  region:          process.env.AWS_REGION     || 'ap-southeast-2',
  accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

let currentEgressId = null;
let pollTimer       = null;

const uploadedUrls = new Set();

async function pollAndUpload() {
  console.log('폴링함수 호출됨');
  if (!currentEgressId) {
    console.log('현재 egressId 없음');
    return;
  }
  try {
    console.log(`current egressId: ${currntEgressId}`);
    const raw = await axios.post(
      `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/ListEgress`,
      { egress_id: currentEgressId },
      {
        headers: {
          Authorization: `Bearer ${EGRESS_JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        transformResponse: [d => d],
      }
    );
    const { items } = JSON.parse(raw.data);
    const info = items?.[0];
    const segments = info?.output?.segment?.segments || [];
    for (const { url } of segments) {
      console.log(`▶ 다운로드 시작: ${url}`);

      if (!url.endsWith('.ts') || uploadedUrls.has(url)) continue;

      const segBin = await axios.get(url, { responseType: 'arraybuffer' });
      console.log(`다운로드 파일: ${segBin}`);

      const key = path.posix.join(
        process.env.S3_PREFIX || 'egress/',
        path.basename(url)
      );
      console.log(`업로드 시도: ${key}`)

      await s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key:    key,
        Body:   segBin.data,
        ContentType: 'video/mp2t',
      }).promise();
      console.log(`✅ uploaded: ${key}`);
      uploadedUrls.add(url);
    }
  } catch (err) {
    console.error('poll error:', err.message);
  }
}

app.post('/start-recording', async (req, res) => {
  const { roomName } = req.body;
  if (!roomName) {
    return res.status(400).json({ error: 'roomName is required' });
  }
  if (currentEgressId) {
    return res.status(400).json({ error: '이미 녹음 중입니다' });
  }

  const twirpReq = {
    room_name:       roomName,
    audio_track_id:  'mixed',
    segment_outputs: [
      {
        filename_prefix:  `seg_${roomName}.wav`,
        playlist_name:    `seg_${roomName}.m3u8`,
        segment_duration: 10,
        s3: { 
          access_key: process.env.AWS_ACCESS_KEY_ID,
          secret:     process.env.AWS_SECRET_ACCESS_KEY,
          region:     process.env.AWS_REGION     || 'ap-southeast-2',
          bucket:     process.env.S3_BUCKET,
          prefix:     process.env.S3_PREFIX      || 'egress/',
        },
      },
    ],
    stop_on_disconnect: true,
  };

  try {
    const startRaw = await axios.post(
      `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StartRoomCompositeEgress`,
      twirpReq,
      {
        headers: {
          Authorization: `Bearer ${EGRESS_JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        transformResponse: [d => d],
      }
    );
    const { egress_id } = JSON.parse(startRaw.data);
    currentEgressId = egress_id;
    console.log(`▶ egress started: ${egress_id}`);

    pollTimer = setInterval(pollAndUpload, POLL_INTERVAL_MS);

    setTimeout(async () => {
      if (!currentEgressId) return;
      try {
        await axios.post(
          `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StopEgress`,
          { egress_id: currentEgressId },
          {
            headers: {
              Authorization: `Bearer ${EGRESS_JWT_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        pollTimer = setInterval(pollAndUpload, POLL_INTERVAL_MS);
        console.log(`▶ Egress 종료: ${currentEgressId}`);
      } catch (err) {
        console.error('✖ Egress 종료 실패:', err.message);
      } finally {
        pollTimer = setInterval(pollAndUpload, POLL_INTERVAL_MS);
        currentEgressId = null;
      }
    }, 10_000);

    return res.json({ message: 'Recording started', egressId: egress_id });
  } catch (err) {
    console.error('▶ start error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/stop-recording', async (req, res) => {
  if (!currentEgressId) {
    return res.status(400).json({ error: '녹음 중이 아닙니다' });
  }
  try {
    await axios.post(
      `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StopEgress`,
      { egress_id: currentEgressId },
      {
        headers: { Authorization: `Bearer ${EGRESS_JWT_TOKEN}` },
      }
    );
    console.log(`▶ egress stopped: ${currentEgressId}`);
  } catch (err) {
    console.error('▶ stop error:', err.message);
  }

  clearInterval(pollTimer);
  pollTimer = null;
  uploadedUrls.clear();

  return res.json({ message: 'Recording stopped' });
});

async function getSegmentPresignedUrls(bucket, prefix) {
  console.log(`[getSegmentPresignedUrls] 시작 - Bucket: ${bucket}, Prefix: ${prefix}`);
  console.log(`[getSegmentPresignedUrls] 시작 - Bucket: ${bucket}`);

  try {
    const listRes = await s3.listObjectsV2({
      Bucket: bucket,
    }).promise();

    console.log(`[getSegmentPresignedUrls] S3 리스트 조회 성공: ${listRes.KeyCount} 개 키 발견`);

    if (!listRes.Contents) {
      console.warn('[getSegmentPresignedUrls] Contents가 비어있음');
      return [];
    }

    const tsFiles = listRes.Contents.filter(item => item.Key.endsWith('.ts'));

    console.log(`[getSegmentPresignedUrls] .ts 파일 필터링 완료: ${tsFiles.length} 개`);

    const urls = tsFiles.map(file => {
      const params = {
        Bucket: bucket,
        Key: file.Key,
        Expires: 60 * 5,
      };

      const url = s3.getSignedUrl('getObject', params);
      console.log(`[getSegmentPresignedUrls] Presigned URL 생성: ${file.Key}`);
      return { key: file.Key, url };
    });

    return urls;
  } catch (err) {
    console.error('[getSegmentPresignedUrls] 오류 발생:', err);
    throw err;
  }
}

app.get('/segments', async (req, res) => {
  const roomName = req.query.roomName;
  if (!roomName) {
    console.warn('[GET /segments] roomName 쿼리 누락');
    return res.status(400).json({ error: 'roomName query parameter is required' });
  }

  try {
    console.log(`[GET /segments] 요청 처리 시작 - roomName: ${roomName}`);

    const bucket = process.env.S3_BUCKET;
    const prefix = process.env.S3_PREFIX || 'egress/';

    const files = await getSegmentPresignedUrls(bucket, prefix);

    const filtered = files.filter(f => f.key.includes(`seg_${roomName}`));

    console.log(`[GET /segments] roomName 포함된 파일 개수: ${filtered.length}`);

    const result = filtered.map(f => ({
      key: f.key,
      url: f.url,
    }));

    res.json({ segments: result });
  } catch (err) {
    console.error('[GET /segments] S3 파일 조회 오류:', err);
    res.status(500).json({ error: 'Failed to download segments' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
