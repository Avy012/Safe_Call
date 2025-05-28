// // egressController.js

// const express = require('express');
// const axios = require('axios');

// const app = express();
// app.use(express.json());

// // 하드코딩된 JWT 토큰 (Egress 권한)
// const EGRESS_JWT_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21SZWNvcmQiOnRydWUsInJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWUsInJlY29yZGVyIjp0cnVlfSwic3ViIjoiZWdyZXNzIiwiaXNzIjoiQVBJV1JVenJCcktYRUY0IiwibmJmIjoxNzQ4MTcxNDg1LCJleHAiOjE3NDgyNTc4ODV9.BUUD9l_tWUv6sE31Txa5BKy_ZwsRfIrjRs-wOOr28p0";

// // LiveKit 서버 URL
// const LIVEKIT_URL = 'https://safecall-ozn2xsg6.livekit.cloud'; // 예: https://cloud.lke.rs

// /**
//  * POST /start-recording
//  * 요청 바디: { roomName: string }
//  * 해당 룸의 오디오 녹음을 시작하고 결과를 반환합니다.
//  */
// app.post('/start-recording', async (req, res) => {
//   console.log('▶ /start-recording 요청 받음:', req.body);

//   try {
//     const response = await axios.post(
//       `${LIVEKIT_URL}/v1/egress/rooms/${req.body.roomName}/start`,
//       {
//         output: {
//           file: {
//             name: `rec_${req.body.roomName}`,
//             type: 'audio',
//             path: './audio'
//           },
//           s3: {
//             region: 'ap-northeast-2',      // S3 리전
//             bucket: 'safecall-record',           // 버킷 이름
//             path: 'audio-exports/'         // (선택) 저장할 폴더 경로(프리픽스)
//           }
//         }
//       }, 
//       {
//         headers: {
//           Authorization: `Bearer ${EGRESS_JWT_TOKEN}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     console.log('◀ LiveKit Egress 응답:', response.data);
//     return res.json({ message: 'Egress 녹음 시작됨', data: response.data });
//   } catch (err) {
//     console.error('✖ LiveKit Egress 호출 에러 전체:', err);
//     if (err.response) {
//       console.error('✖ LiveKit 에러 응답 데이터:', err.response.data);
//     }
//     return res.status(500).json({ error: 'Egress 시작 실패' });
//   }
// });

// // 서버 리스닝 설정
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Egress 서비스 실행 중: http://localhost:${PORT}`);
// });


// // egressController.js

// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const AWS = require('aws-sdk');
// const path = require('path');

// const app = express();
// app.use(express.json());

// // 1) LiveKit HTTP 호스트 (WebSocket URL의 wss:// → https://)
// const LIVEKIT_SERVER_URL = 'https://safecall-ozn2xsg6.livekit.cloud';

// // 2) Egress 전용 JWT 토큰 로드
// const EGRESS_JWT_TOKEN ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21SZWNvcmQiOnRydWUsInJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWUsInJlY29yZGVyIjp0cnVlfSwic3ViIjoiZWdyZXNzIiwiaXNzIjoiQVBJV1JVenJCcktYRUY0IiwibmJmIjoxNzQ4MTcxNDg1LCJleHAiOjE3NDgyNTc4ODV9.BUUD9l_tWUv6sE31Txa5BKy_ZwsRfIrjRs-wOOr28p0";

// // 3) AWS S3 클라이언트 설정 (환경 변수 사용)
// const s3 = new AWS.S3({
//   region:          process.env.AWS_REGION     || 'ap-southeast-2',
//   accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// // 업로드한 URL 중복 방지용 Set
// const uploaded = new Set();

// // Egress 세그먼트 리스트 폴링 및 수동 업로드 함수
// async function pollAndUpload(egressId) {
//   try {
//     const res = await axios.post(
//       `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/ListEgress`,
//       { egress_id: egressId },
//       { headers: { Authorization: `Bearer ${EGRESS_JWT_TOKEN}` } }
//     );
//     const segments = res.data.egress_info?.[0]?.output?.segment?.segments || [];
//     for (const seg of segments) {
//       if (uploaded.has(seg.url)) continue;
//       // 세그먼트 다운로드
//       const segData = await axios.get(seg.url, { responseType: 'arraybuffer' });
//       // S3 업로드
//       const key = path.posix.join(
//         process.env.S3_PREFIX || 'egress/',
//         path.basename(seg.url)
//       );
//       await s3.putObject({
//         Bucket: process.env.S3_BUCKET,
//         Key:    key,
//         Body:   segData.data,
//       }).promise();
//       console.log(`✅ Uploaded segment to S3: ${key}`);
//       uploaded.add(seg.url);
//     }
//   } catch (err) {
//     console.error('Polling/upload error:', err.response?.data || err.message);
//   }
// }

// // POST /start-recording
// // 15초 단위 세그먼트 녹음 후 S3 업로드
// app.post('/start-recording', async (req, res) => {
//   const { roomName } = req.body;
//   console.log('▶ /start-recording 요청:', roomName);

//   try {
//     // Twirp RPC payload: StartTrackCompositeEgress
//     const twirpReq = {
//       room_name:      roomName,
//       audio_track_id: 'mixed',        // 룸의 모든 오디오를 합친 mixed 트랙
//       segment_outputs: [
//         {
//           filename_prefix:  `seg_${roomName}`,       // 세그먼트 파일명 접두사
//           playlist_name:    `seg_${roomName}.m3u8`,  // 매니페스트 이름
//           segment_duration: 15,                      // 15초 단위
//           s3: {
//             access_key: process.env.AWS_ACCESS_KEY_ID,
//             secret:     process.env.AWS_SECRET_ACCESS_KEY,
//             region:     process.env.AWS_REGION     || 'ap-southeast-2',
//             bucket:     process.env.S3_BUCKET,
//             prefix:     process.env.S3_PREFIX       || 'egress/',
//           },
//         },
//       ],
//       stop_on_disconnect: false,  // 테스트용으로 false
//     };

//     // 1) 녹음 세그먼트 시작 호출
//     const startRes = await axios.post(
//       `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StartTrackCompositeEgress`,
//       twirpReq,
//       {
//         headers: {
//           Authorization: `Bearer ${EGRESS_JWT_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     console.log('↳ LiveKit Egress 시작 응답:', startRes.data);

//     const egressId = startRes.data.egress_id;
//     if (!egressId) throw new Error('egress_id가 없습니다');

//     // 시작 성공 응답 전송
//     res.json({ message: 'Egress 세그먼트 녹음 시작됨', egressId });

//     // 2) 폴링 시작: 5초마다 새 세그먼트 체크 및 S3 업로드
//     const interval = setInterval(() => pollAndUpload(egressId), 5_000);

//     // 선택: 세션 종료 시 폴링 종료 (stop_on_disconnect가 true일 때)
//     axios.post(
//       `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/ListEgress`,
//       { egress_id: egressId },
//       { headers: { Authorization: `Bearer ${EGRESS_JWT_TOKEN}` } }
//     ).then(statusRes => {
//       const info = statusRes.data.egress_info?.[0];
//       if (info?.status !== 'ACTIVE') {
//         clearInterval(interval);
//         console.log('▶ Egress 세션 종료, 폴링 중지');
//       }
//     }).catch(() => {/* ignore */});

//   } catch (err) {
//     console.error('✖ Egress 시작 에러:', err.response?.data || err.message);
//     res.status(500).json({ error: 'Egress 시작 실패', detail: err.response?.data || err.message });
//   }
// });

// // 서버 리스닝
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`Egress 서비스 실행 중: http://localhost:${PORT}`));




// egressController.js

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const AWS = require('aws-sdk');
const path = require('path');

const app = express();
app.use(express.json());

const LIVEKIT_SERVER_URL = 'https://safecall-ozn2xsg6.livekit.cloud';
const EGRESS_JWT_TOKEN   = process.env.EGRESS_JWT_TOKEN;
const POLL_INTERVAL_MS   = 15_000;  // 5초마다 새 세그먼트 체크

// AWS S3 클라이언트
const s3 = new AWS.S3({
  region:          process.env.AWS_REGION     || 'ap-southeast-2',
  accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// 현재 실행 중인 Egress 세션 정보
let currentEgressId = null;
let pollTimer       = null;
// 이미 업로드한 URL 중복 방지
const uploadedUrls = new Set();

// 새 세그먼트가 생겼나 폴링해서 바로 S3 업로드
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
    // segments URL 리스트는 info.output.segment.segments 에 있습니다
    const segments = info?.output?.segment?.segments || [];
    for (const { url } of segments) {
      console.log(`▶ 다운로드 시작: ${url}`);

      if (!url.endsWith('.ts') || uploadedUrls.has(url)) continue;
      // 다운로드
      const segBin = await axios.get(url, { responseType: 'arraybuffer' });
      console.log(`다운로드 파일: ${segBin}`);
      // S3에 업로드
      const key = path.posix.join(
        process.env.S3_PREFIX || 'egress/',
        path.basename(url)
      );
      console.log(`업로드 시도: ${key}`)

      await s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key:    key,
        Body:   segBin.data,
        // ContentType: 'video/mp2t',
        ContentType: 'auido',
      }).promise();
      console.log(`✅ uploaded: ${key}`);
      uploadedUrls.add(url);
    }
  } catch (err) {
    console.error('poll error:', err.message);
  }
  // currentEgressId = null;
}


// app.post('/start-full-recording', async (req, res) => {
//   const { roomName } = req.body;
//   if (!roomName) {
//     return res.status(400).json({ error: 'roomName is required' });
//   }
//   if (currentEgressId) {
//     return res.status(400).json({ error: '이미 녹음 중입니다' });
//   }

//   // 1) TrackCompositeEgress 호출
//   const twirpReq = {
//     room_name:       roomName,
//     audio_track_id:  'mixed',
//     segment_outputs: [
//       {
//         filename_prefix:  `seg_full_${roomName}`,
//         playlist_name:    `seg_full_${roomName}.m3u8`,
//         segment_duration: 15,
//         s3: { 
//           access_key: process.env.AWS_ACCESS_KEY_ID,
//           secret:     process.env.AWS_SECRET_ACCESS_KEY,
//           region:     process.env.AWS_REGION     || 'ap-southeast-2',
//           bucket:     process.env.S3_BUCKET,
//           prefix:     process.env.S3_PREFIX      || 'egress/',
//         },
//       },
//     ],
//     stop_on_disconnect: true,
//   };

//   try {
//     const startRaw = await axios.post(
//       `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StartRoomCompositeEgress`,
//       twirpReq,
//       {
//         headers: {
//           Authorization: `Bearer ${EGRESS_JWT_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//         transformResponse: [d => d],
//       }
//     );
//     const { egress_id } = JSON.parse(startRaw.data);
//     currentEgressId = egress_id;
//     console.log(`▶ egress started: ${egress_id}`);

//     // 2) 15초 후 자동 종료 요청
//     setTimeout(async () => {
//       if (!currentEgressId) return;
//       try {
//         await axios.post(
//           `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StopEgress`,
//           { egress_id: currentEgressId },
//           {
//             headers: {
//               Authorization: `Bearer ${EGRESS_JWT_TOKEN}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         console.log(`▶ Egress 종료: ${currentEgressId}`);
//       } catch (err) {
//         console.error('✖ Egress 종료 실패:', err.message);
//       } finally {
//         currentEgressId = null;
//       }
//     });


//     // 3) 10초마다 새 세그먼트 체크
//     pollTimer = setInterval(pollAndUpload, POLL_INTERVAL_MS);

//     return res.json({ message: 'Recording started', egressId: egress_id });
//   } catch (err) {
//     console.error('▶ start error:', err.message);
//     return res.status(500).json({ error: err.message });
//   }
// }, 15000);

// // POST /stop-recording — 세션 종료 & 폴링 멈춤
// app.post('/stop-recording', async (req, res) => {
//   if (!currentEgressId) {
//     return res.status(400).json({ error: '녹음 중이 아닙니다' });
//   }
//   try {
//     await axios.post(
//       `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StopEgress`,
//       { egress_id: currentEgressId },
//       {
//         headers: { Authorization: `Bearer ${EGRESS_JWT_TOKEN}` },
//       }
//     );
//     console.log(`▶ egress stopped: ${currentEgressId}`);
//   } catch (err) {
//     console.error('▶ stop error:', err.message);
//   }

//   clearInterval(pollTimer);
//   pollTimer = null;
//   currentEgressId = null;
//   uploadedUrls.clear();

//   return res.json({ message: 'Recording stopped' });
// });


// POST /start-recording — Egress 시작 & 폴링 루프 시작
app.post('/start-recording', async (req, res) => {
  const { roomName } = req.body;
  if (!roomName) {
    return res.status(400).json({ error: 'roomName is required' });
  }
  if (currentEgressId) {
    return res.status(400).json({ error: '이미 녹음 중입니다' });
  }

  // 1) TrackCompositeEgress 호출
  const twirpReq = {
    room_name:       roomName,
    audio_track_id:  'mixed',
    segment_outputs: [
      {
        file_type: "wav",
        filename_prefix:  `seg_${roomName}`,
        playlist_name:    `seg_${roomName}.wav`,
        segment_duration: 15,
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
      // `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StartRoomCompositeEgress`,
      `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StartTrackCompositeEgress`,
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

    // 3) 15초마다 새 세그먼트 체크
    pollTimer = setInterval(pollAndUpload, POLL_INTERVAL_MS);

    // 2) 15초 후 자동 종료 요청
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
        // 3) 10초마다 새 세그먼트 체크
        pollTimer = setInterval(pollAndUpload, POLL_INTERVAL_MS);
        console.log(`▶ Egress 종료: ${currentEgressId}`);
      } catch (err) {
        console.error('✖ Egress 종료 실패:', err.message);
      } finally {
        // 3) 10초마다 새 세그먼트 체크
        pollTimer = setInterval(pollAndUpload, POLL_INTERVAL_MS);
        currentEgressId = null;
      }
    }, 15_000);

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
  // currentEgressId = null;
  uploadedUrls.clear();

  return res.json({ message: 'Recording stopped' });
});


// 룸네임 포함 .ts 파일 리스트 조회 및 신규 파일만 다운로드
// async function fetchSegmentsAndDownload(roomName) {
//   const bucket = process.env.S3_BUCKET;
//   const prefix = process.env.S3_PREFIX || 'egress/';

//   // 1) S3 객체 리스트 조회
//   const listRes = await s3.listObjectsV2({
//     Bucket: bucket,
//     Prefix: prefix,
//   }).promise();

//   // 룸네임 포함 + .ts 파일 필터링
//   const segmentKeys = listRes.Contents
//     .filter(item => item.Key.includes(roomName) && item.Key.endsWith('.ts'))
//     .map(item => item.Key);

//   const newFiles = [];

//   for (const key of segmentKeys) {
//     if (downloadedFiles.has(key)) {
//       continue; // 이미 다운로드한 파일 건너뜀
//     }

//     // 파일 존재 확인 (HeadObject)
//     try {
//       await s3.headObject({ Bucket: bucket, Key: key }).promise();
//     } catch (err) {
//       console.warn(`파일 없음 또는 접근 불가: ${key}`, err.message);
//       continue;
//     }

//     // 실제 다운로드
//     try {
//       const fileRes = await s3.getObject({ Bucket: bucket, Key: key }).promise();
//       newFiles.push({
//         key,
//         data: fileRes.Body,
//       });
//       downloadedFiles.add(key); // 다운로드 기록
//     } catch (err) {
//       console.error(`다운로드 실패: ${key}`, err.message);
//     }
//   }

//   return newFiles; // 신규 다운로드 파일 목록 반환
// }



// async function getSegmentPresignedUrls(bucket, prefix) {
//   const listRes = await s3.listObjectsV2({
//     Bucket: bucket,
//     Prefix: prefix,
//   }).promise();

//   const tsFiles = listRes.Contents.filter(item => item.Key.endsWith('.ts'));

//   const urls = tsFiles.map(file => {
//     const params = {
//       Bucket: bucket,
//       Key: file.Key,
//       Expires: 60 * 5, // 유효시간 5분
//     };
    
//     const url = s3.getSignedUrl('getObject', params);
//     return { Key: file.Key, url };
//   });

//   return urls;
// }

// // GET /segments?roomName=룸명 → 룸네임 포함 신규 .ts 파일 다운로드 후 메타만 반환
// app.get('/segments', async (req, res) => {
//   const roomName = req.query.roomName;
//   if (!roomName) {
//     return res.status(400).json({ error: 'roomName query parameter is required' });
//   }

//   try {
//     const files = await getSegmentPresignedUrls(roomName);

//     // 파일명과 버퍼 길이만 전송 (필요시 base64 인코딩 가능)
//     const result = files.map(f => ({
//       key: f.key,
//       url: f.url,
//     }));

//     res.json({ segments: result });
//   } catch (err) {
//     console.error('S3 파일 다운로드 오류:', err);
//     res.status(500).json({ error: 'Failed to download segments' });
//   }
// });



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
        Expires: 60 * 5, // 유효시간 5분
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

// GET /segments?roomName=룸명 → 룸네임 포함 신규 .ts 파일 다운로드 후 메타만 반환
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

    // 룸 이름 포함된 파일만 필터링
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



// 서버 시작
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});





// // egressController.js

// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');

// const app = express();
// app.use(express.json());

// const LIVEKIT_SERVER_URL = 'https://safecall-ozn2xsg6.livekit.cloud';
// const EGRESS_JWT_TOKEN   = process.env.EGRESS_JWT_TOKEN;

// axios.interceptors.request.use(r => {
//   console.log(`→ [${new Date().toISOString()}] ${r.method.toUpperCase()} ${r.url}`);
//   return r;
// });
// axios.interceptors.response.use(r => {
//   console.log(`← [${new Date().toISOString()}] ${r.status} ${r.config.url}`);
//   return r;
// }, e => {
//   console.error(`✖ [${new Date().toISOString()}]`, e.message);
//   return Promise.reject(e);
// });

// const getDateTimeString = () => {
//   const now = new Date();
//   const pad = (n) => n.toString().padStart(2, '0');
//   return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
// };

// // 15초 사이클로 RoomCompositeEgress 시작→종료 반복
// async function cycleRoomComposite(roomName) {
//   const dateTimeStr = getDateTimeString();
//   // 1) payload 정의
//   const twirpReq = {
//     room_name:         roomName,
//     layout:            'grid',      // HLS 세그먼트를 생성하려면 반드시 layout 지정
//     audio_only:        false,       // video 트랙이 없어도 검은 화면으로 처리
//     segment_outputs: [
//       {
//         filename_prefix:  `seg_${roomName}`,
//         playlist_name:    `seg_${roomName}.m3u8`,
//         segment_duration: 15,        // 15초 단위
//         s3: {
//           access_key: process.env.AWS_ACCESS_KEY_ID,
//           secret:     process.env.AWS_SECRET_ACCESS_KEY,
//           region:     process.env.AWS_REGION     || 'ap-northeast-2',
//           bucket:     process.env.S3_BUCKET,
//           prefix:     process.env.S3_PREFIX       || 'egress/',
//         },
//       },
//     ],
//     stop_on_disconnect: true,       // 자동 중단 OFF
//   };

//   try {
//     // 2) RoomCompositeEgress 시작
//     const startRaw = await axios.post(
//       `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StartRoomCompositeEgress`,
//       twirpReq,
//       {
//         headers: {
//           Authorization: `Bearer ${EGRESS_JWT_TOKEN}`,
//           'Content-Type':  'application/json',
//         },
//         transformResponse: [(d) => d],  // 원본 텍스트 보존
//       }
//     );
//     const startData = JSON.parse(startRaw.data);
//     const egressId  = startData.egress_id;
//     console.log(`▶ Egress started (${egressId})`);

//     // 3) 15초 뒤 Egress 세션 종료
//     setTimeout(async () => {
//       try {
//         await axios.post(
//           `${LIVEKIT_SERVER_URL}/twirp/livekit.Egress/StopEgress`,
//           { egress_id: egressId },
//           { headers: { Authorization: `Bearer ${EGRESS_JWT_TOKEN}` } }
//         );
//         console.log(`▶ Egress stopped (${egressId})`);
//       } catch (stopErr) {
//         console.error('StopEgress failed:', stopErr.message);
//       }
//       // 한 사이클 마치면 재귀로 다시 시작
//       cycleRoomComposite(roomName);
//     }, 15_000);

//   } catch (startErr) {
//     console.error('StartRoomCompositeEgress failed:', startErr.message);
//     // 5초 후 재시도
//     setTimeout(() => cycleRoomComposite(roomName), 5_000);
//   }
// }

// // POST /start-recording → 사이클 시작
// app.post('/start-recording', (req, res) => {
//   const { roomName } = req.body;
//   if (!roomName) {
//     return res.status(400).json({ error: 'roomName is required' });
//   }
//   cycleRoomComposite(roomName);
//   res.json({ message: '15초 단위 RoomCompositeEgress 루프 시작됨', roomName });
// });

// // 서버 실행
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Egress service listening on port ${PORT}`);
// });
