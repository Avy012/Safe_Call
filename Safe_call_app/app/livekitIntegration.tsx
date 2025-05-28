import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useState } from 'react';

const CLOUD_RUN_URL = 'https://egress-server-699745003469.asia-northeast3.run.app';

let recordingObj: Audio.Recording | null = null;
let isRecordingActive = false; // 녹음 상태를 추적하는 플래그
let recordTimeout: ReturnType<typeof setTimeout> | null = null;


async function getBase64FromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // data:application/octet-stream;base64,AAA... 형태이므로
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject('파일을 base64 문자열로 변환 실패');
      }
    };
    reader.onerror = () => reject('FileReader 오류');
    reader.readAsDataURL(blob);
  });
}

function getCurrentTimeString() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export const handleLocalMicRecording = async (roomName: string) => {
  console.log('[handleLocalMicRecording] 시작 – roomName=', roomName);

  // 이미 녹음 중이면 실행하지 않음
  if (isRecordingActive) {
    console.log('[녹음] 이미 녹음 중입니다.');
    return;
  }

  try {
    // 이전 녹음 종료
    if (recordingObj) {
      const status = await recordingObj.getStatusAsync();
      if (status.isRecording || status.canRecord) {
        await recordingObj.stopAndUnloadAsync();
      }
      recordingObj = null;
    }

    if (recordTimeout) {
      clearTimeout(recordTimeout);
      recordTimeout = null;
    }

    // 권한 요청
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('마이크 권한이 필요합니다!');
      return;
    }

    const recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY;

    const recordAndSend = async () => {
      if (isRecordingActive) return; // 중복 실행 방지
      isRecordingActive = true;

      recordingObj = new Audio.Recording();
      await recordingObj.prepareToRecordAsync(recordingOptions);
      await recordingObj.startAsync();

      // 15초 후 녹음 중지, 파일 처리, Egress API 호출
      recordTimeout = setTimeout(async () => {
        try {
          if (recordingObj) {
            const status = await recordingObj.getStatusAsync();
            if (status.isRecording || status.canRecord) {
              await recordingObj.stopAndUnloadAsync();
              const uri = recordingObj.getURI();
              recordingObj = null;
              isRecordingActive = false;

              if (uri) {
                // 로컬에 저장된 파일을 base64로 읽어 서버 전송 가능
                const base64Audio = await FileSystem.readAsStringAsync(uri, {
                  encoding: FileSystem.EncodingType.Base64,
                });

                console.log('[Egress] fetch 호출 직전');

                try {
                  const resp = await fetch(`${CLOUD_RUN_URL}/start-recording`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomName }),
                  });
                  const json = await resp.json();
                  console.log('Egress API 호출 완료:', json);
                  console.log('[Egress] fetch 응답 직후, status=', resp.status);
                } catch (e) {
                  console.error('Egress 호출 실패:', e);
                }

                // 로컬 파일 저장/업로드 로직
                const timeStr = getCurrentTimeString();
                const audioFileName = `audio_${timeStr}.m4a`;
                const audioPath = FileSystem.documentDirectory + audioFileName;
                try {
                  await FileSystem.writeAsStringAsync(audioPath, base64Audio, {
                    encoding: FileSystem.EncodingType.Base64,
                  });
                  console.log('로컬 오디오 파일 저장 완료:', audioPath);
                } catch (e) {
                  console.error('오디오 파일 저장 실패:', e);
                }

                // 임시 파일 삭제
                await FileSystem.deleteAsync(uri, { idempotent: true });
              }
            }
          }
        } catch (e) {
          console.error('녹음 처리 중 에러:', e);
          isRecordingActive = false;
        }

        // 15초마다 segments API 호출해서 업로드된 ts 파일 리스트 확인
        try {
          const segResp = await fetch(`${CLOUD_RUN_URL}/segments?roomName=${encodeURIComponent(roomName)}`);

          if (segResp.ok) {
            const segJson = await segResp.json();
            console.log('[Segments API] 업로드된 세그먼트 리스트:', segJson.segments);

            const segments = segJson.segments;
            if (segments && segments.length > 0) {
              for (const segment of segments) {
                try {
                  const base64Data = await getBase64FromUrl(segment.url);

                  const sttLambdaUrl = 'https://usyvahybz2.execute-api.us-east-1.amazonaws.com/dev/audio';
                  const sttResponse = await axios.post(sttLambdaUrl, { audio: base64Data });
                  const text = sttResponse.data.body || '';

                  console.log(`람다 요약: ${text}`);

                } catch (err) {
                  console.error(`Base64 변환 실패: ${segment.key}`, err);
                }
              }
            } else {
              console.log('처리할 세그먼트가 없습니다.');
            }
          } else {
            console.warn('[Segments API] 응답 실패:', segResp.status);
          }
        } catch (e) {
          console.error('[Segments API] 호출 실패:', e);
        }


        recordAndSend();
      }, 10000); // 15초 후 녹음 멈추기
    };

    recordAndSend();
  } catch (err) {
    console.error('로컬 마이크 녹음 처리 에러:', err);
  }
};

export const stopLocalMicRecording = async () => {
  try {
    // 1) 기존 로컬 녹음 중지 처리
    if (recordTimeout) {
      clearTimeout(recordTimeout);
      recordTimeout = null;
    }

    if (recordingObj) {
      const status = await recordingObj.getStatusAsync();
      if (status.isRecording || status.canRecord) {
        await recordingObj.stopAndUnloadAsync();
      }
      recordingObj = null;
    }

    isRecordingActive = false;
    console.log('[녹음] 로컬 녹음 중지 완료');

    // 2) 서버에 StopEgress 요청 호출 (fetch, axios 등 사용)
    const response = await fetch(`${CLOUD_RUN_URL}/stop-recording`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* 필요시 데이터 추가 */ }),
    });

    if (!response.ok) {
      console.error('[녹음] StopEgress API 호출 실패:', response.statusText);
    } else {
      console.log('[녹음] StopEgress API 호출 성공');
    }

  } catch (e) {
    console.log('[녹음] 중지 실패:', e);
  }
};
