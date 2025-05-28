// import AudioRecord from 'react-native-audio-record';
// import RNFS from 'react-native-fs';
// import { Buffer } from 'buffer';

// // 시간 문자열 생성 헬퍼
// function getCurrentTimeString() {
//   const now = new Date();
//   const pad = (n: number) => n.toString().padStart(2, '0');
//   return `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
// }

// // WAV 헤더 생성 함수
// function writeString(view: DataView, offset: number, str: string) {
//   for (let i = 0; i < str.length; i++) {
//     view.setUint8(offset + i, str.charCodeAt(i));
//   }
// }
// function createWavHeader(dataLength: number, sampleRate = 16000, numChannels = 1, bitsPerSample = 16) {
//   const blockAlign = numChannels * bitsPerSample / 8;
//   const byteRate = sampleRate * blockAlign;
//   const buffer = new ArrayBuffer(44);
//   const view = new DataView(buffer);

//   writeString(view, 0, 'RIFF');
//   view.setUint32(4, 36 + dataLength, true);
//   writeString(view, 8, 'WAVE');
//   writeString(view, 12, 'fmt ');
//   view.setUint32(16, 16, true);
//   view.setUint16(20, 1, true);
//   view.setUint16(22, numChannels, true);
//   view.setUint32(24, sampleRate, true);
//   view.setUint32(28, byteRate, true);
//   view.setUint16(32, blockAlign, true);
//   view.setUint16(34, bitsPerSample, true);
//   writeString(view, 36, 'data');
//   view.setUint32(40, dataLength, true);

//   return Buffer.from(buffer);
// }

// // 오디오 스트림 처리 함수
// export const handleAudioStream = (mediaStream: MediaStream) => {
//   console.log('핸들러 진입');
//   const audioTrack = mediaStream.getAudioTracks()[0];
//   console.log('★ 받아온 미디어 스트림의 오디오 트랙: ', audioTrack);
//   if (!audioTrack) {
//     console.error('No audio track found!');
//     return;
//   }

//   const options = {
//     sampleRate: 16000,
//     channels: 1,
//     bitsPerSample: 16,
//     wavFile: 'audio.wav'
//   };

//   AudioRecord.init(options);
//   AudioRecord.start();

//   setInterval(async () => {
//     try {
//       const audioFilePath = await AudioRecord.stop();
//       console.log('녹음 저장 경로:', audioFilePath);

//       const base64Audio = await RNFS.readFile(audioFilePath, 'base64');

//       // callId는 외부에서 관리해서 넣어주세요 (예: 상태값)
//       const currentCallId = 1; // 임시값, 필요에 따라 관리하세요

//       await sendAudioToServerBase64(base64Audio, currentCallId);

//       await AudioRecord.start();
//     } catch (error) {
//       console.error('Error during audio capture:', error);
//     }
//   }, 15000);
// };

// // callId 반영한 sendAudioToServerBase64
// const sendAudioToServerBase64 = async (base64Audio: string, callId: number) => {
//   const timeStr = getCurrentTimeString();

//   const pcmFileName = `audio_${timeStr}_${callId}.pcm`;
//   const wavFileName = `audio_${timeStr}_${callId}.wav`;

//   const pcmPath = RNFS.DocumentDirectoryPath + '/' + pcmFileName;
//   const wavPath = RNFS.DocumentDirectoryPath + '/' + wavFileName;

//   try {
//     await RNFS.writeFile(pcmPath, base64Audio, 'base64');
//     console.log('PCM 파일 저장 완료:', pcmPath);
//   } catch (e) {
//     console.error('PCM 파일 저장 실패:', e);
//   }

//   try {
//     const pcmBuffer = Buffer.from(base64Audio, 'base64');
//     const wavHeader = createWavHeader(pcmBuffer.length);
//     const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
//     const wavBase64 = wavBuffer.toString('base64');
//     await RNFS.writeFile(wavPath, wavBase64, 'base64');
//     console.log('WAV 파일 저장 완료:', wavPath);
//   } catch (e) {
//     console.error('WAV 파일 저장 실패:', e);
//   }
// };

// // export async function startEgress(roomName: string, identity: string) {
// //   console.log('이그레스 시작 함수 진입');
// //   const resp = await fetch('http://10.0.2.2/start_egress', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify({ room_name: roomName, identity }),
// //   });
// //   const json = await resp.json();
// //   console.log('startEgress 응답:', json);
// //   return json;
// // }

// // export async function stopEgress(egressId: string) {
// //   console.log('이그레스 중단 함수 진입');
// //   const resp = await fetch('http://10.0.2.2/stop_egress', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify({ egress_id: egressId }),
// //   });
// //   const json = await resp.json();
// //   console.log('stopEgress 응답:', json);
// //   return json;
// // }


// // livekitIntegration.tsx

// // const LIVEKIT_EGRESS_URL = "https://cloud.lke.rs/v1/egress/participant";

// // // 서비스 계정 JSON 문자열 (보안상 주의하세요)
// // const gcpCredentialsJson = `{
// //   "type": "service_account",
// //   "project_id": "clever-cyclist-460617-c3",
// //   "private_key_id": "3a755b13d0121546e4854992ddb86ba2b50ffab3",
// //   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6BtNsKbLJcrR5\nSq+Gdrpd91AD+6Q/LYMdcagaVFJRC8CUknq5s7pOhGeWDDPYOCSITpckIPodKvVK\ne2FGEPsSagddllym2/xsCu8IMmIYzEY/L+YSwAto9LfCPTRfePn/qOIg0ZenNNZv\nTuz1lsUefrJJUXYzbhQDLSg74A8dtH8L6Sc/At0zqHw3XDBWqVn/OfqKlbx4SmqO\nYv+uPUzvPooQptNa9l9AzfOmnIVw41ZCHOvcdHGRiNPHjoucHJcJLPBGJfr7Q2Jl\nisOQO4jrwFd9Vhlz/6vzXLvkACSgGT34kRWyiRJ75UsNUSi83zlxrMPqAw77+nd8\nA9P8QhqHAgMBAAECggEAXPThPBjgHrrjRQLVkAcPHLpi8QKTcgB/lrx/KFz/X0FU\no8lIazhMvkR6cKe7Vm3Dj5tZ+jNCWEXpmaTqmDUPCQYTlSf4N2cRDTovdLScgVC+\nP3/jY3Y0nWc/1d94psaQgjj1ejnRoruL9cYGMbh72r+rvmhm/M8iT+4GP1k4pHn9\ns4OW8LcV5FooCj0zYBFjn5twV27bFZDBlDB0Bs/9u9MO2pCd3TP+m1tvPaa8XT2H\nXzBm1B2x5bEmqE1xES4xAH0PKWpm1wXiC1knvAEXdKX4GVKpsm1UG2PMMSpsOn17\nFT89jlpD44MrmgEnPXCAM9v90RvjW06Hgd7AJJyQvQKBgQDabAFt8+q/cucIfJE1\n9tYf3ZOwatHAUdENX5NWE2l5Geko/tSajIEw8FX6aExT7FF+yU7UHkd/SutmHQjo\nLQOe18yW8hUfZLYJrUD1oXMa4rDWTE/UUeKA49sRQwMiE1M6tBALOCGWymhcjwoA\nREyeEIInp5kcvyVIYMw0lytRPQKBgQDaCAgBTXRsmeRvRlLA1IV5519JaOm73dae\nGc9mIgRjI4i1iHFaMOd2GrOzJXZ0UMsq+xdk3+QJJFMbpR6eAAaIBO10hkJgnvgu\n3HLqB76UnXVDMv8L/jqme99dvVkZynz+/2Xdu2a+GQyXJp9LaLW1cWqyq6CQoJKb\nVegMPvKPEwKBgQC8SWTGEwFm/jcZAsDu4xTcrVa2Oq8L+bubqqtJBTzj7ykmdN5z\nR/HKbTPAxA4gPlRWVlUE2AFMQxo/kYHvG3bGhELSUGdTA69FEjwwQngGUiqc4XXj\nkp8N+t4KuFjIFB6oOTanZUDXSy7Bs3CsoDPoAlUguAJuXHxYM1F1eGcYBQKBgF1q\nGXvtYpdxLAVc/PGvXGzJa/L450PdnSlp54lbw8NyIw2cIuzAjTr1384+m8zkHNgS\ncoh+wKYGETGEAmUxn5rBebd2GpRpJ+5z9yw8GzRzbh1XiRzrVNeltSLlkHpTXlCm\nvk9NDo0eEF3mZ1OYzlmp+UwJ6qZslcPF/8DXa3dPAoGATXRTQw5Wp0xcWdmZvprB\nWP7qjXGQ8dGrujgCsx88LS+ulOymwYAaji/AO62y2qPw18m08nNKe/YbQPNZ9y0/\nBthuf+M89fEbbbZHHqH3u11CoyTb0akoU/+vqtfpc+AW2uO7X4izaJerJmy4Zcqq\nuklDUl2xv7RJYPWf1wko4No=\n-----END PRIVATE KEY-----\n",
// //   "client_email": "safecall-recorder@clever-cyclist-460617-c3.iam.gserviceaccount.com",
// //   "client_id": "114224097282188276707",
// //   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
// //   "token_uri": "https://oauth2.googleapis.com/token",
// //   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
// //   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/safecall-recorder%40clever-cyclist-460617-c3.iam.gserviceaccount.com",
// //   "universe_domain": "googleapis.com"
// // }`;

// // // LiveKit 토큰 (만료시간 주의)
// // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJtaiIsImlzcyI6IkFQSVdSVXpyQnJLWEVGNCIsIm5iZiI6MTc0Nzk3NDQxOSwiZXhwIjoxNzQ3OTk2MDE5fQ.ANKGqbNw4SU7BqtedbD1QBewMj9GPTVt_RL-b19Q7uI";; // 발급받은 JWT 토큰 넣기

// // export async function startEgress(roomName: string, identity: string) {
// //   console.log('이그레스 호출 함수 진입');
// //   const body = {
// //     room_name: roomName,
// //     identity: identity,
// //     audio_only: true,
// //     gcp_outputs: [
// //       {
// //         bucket: "safecall-record",
// //         filepath: `${roomName}/${identity}/${Date.now()}.mp4`,
// //         credentials_json: gcpCredentialsJson,
// //       },
// //     ],
// //   };

// //   const response = await fetch(LIVEKIT_EGRESS_URL, {
// //     method: "POST",
// //     headers: {
// //       Authorization: `Bearer ${token}`,
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(body),
// //   });

// //   if (!response.ok) {
// //     const text = await response.text();
// //     throw new Error(`Egress start failed: ${response.status} ${text}`);
// //   }

// //   return response.json();
// // }

// // export async function stopEgress(egressId: string) {
// //   console.log('이그레스 중단 함수 진입');
// //   const stopUrl = `https://cloud.lke.rs/v1/egress/${egressId}/stop`;

// //   const response = await fetch(stopUrl, {
// //     method: "POST",
// //     headers: {
// //       Authorization: `Bearer ${token}`,
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!response.ok) {
// //     const text = await response.text();
// //     throw new Error(`Egress stop failed: ${response.status} ${text}`);
// //   }

// //   return response.json();
// // }

// // const LIVEKIT_EGRESS_URL = "https://cloud.lke.rs/v1/egress/participant";

// // // 서비스 계정 JSON 문자열 (보안상 주의하세요)
// // const gcpCredentialsJson = `{
// //   "type": "service_account",
// //   "project_id": "clever-cyclist-460617-c3",
// //   "private_key_id": "3a755b13d0121546e4854992ddb86ba2b50ffab3",
// //   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6BtNsKbLJcrR5\nSq+Gdrpd91AD+6Q/LYMdcagaVFJRC8CUknq5s7pOhGeWDDPYOCSITpckIPodKvVK\ne2FGEPsSagddllym2/xsCu8IMmIYzEY/L+YSwAto9LfCPTRfePn/qOIg0ZenNNZv\nTuz1lsUefrJJUXYzbhQDLSg74A8dtH8L6Sc/At0zqHw3XDBWqVn/OfqKlbx4SmqO\nYv+uPUzvPooQptNa9l9AzfOmnIVw41ZCHOvcdHGRiNPHjoucHJcJLPBGJfr7Q2Jl\nisOQO4jrwFd9Vhlz/6vzXLvkACSgGT34kRWyiRJ75UsNUSi83zlxrMPqAw77+nd8\nA9P8QhqHAgMBAAECggEAXPThPBjgHrrjRQLVkAcPHLpi8QKTcgB/lrx/KFz/X0FU\no8lIazhMvkR6cKe7Vm3Dj5tZ+jNCWEXpmaTqmDUPCQYTlSf4N2cRDTovdLScgVC+\nP3/jY3Y0nWc/1d94psaQgjj1ejnRoruL9cYGMbh72r+rvmhm/M8iT+4GP1k4pHn9\ns4OW8LcV5FooCj0zYBFjn5twV27bFZDBlDB0Bs/9u9MO2pCd3TP+m1tvPaa8XT2H\nXzBm1B2x5bEmqE1xES4xAH0PKWpm1wXiC1knvAEXdKX4GVKpsm1UG2PMMSpsOn17\nFT89jlpD44MrmgEnPXCAM9v90RvjW06Hgd7AJJyQvQKBgQDabAFt8+q/cucIfJE1\n9tYf3ZOwatHAUdENX5NWE2l5Geko/tSajIEw8FX6aExT7FF+yU7UHkd/SutmHQjo\nLQOe18yW8hUfZLYJrUD1oXMa4rDWTE/UUeKA49sRQwMiE1M6tBALOCGWymhcjwoA\nREyeEIInp5kcvyVIYMw0lytRPQKBgQDaCAgBTXRsmeRvRlLA1IV5519JaOm73dae\nGc9mIgRjI4i1iHFaMOd2GrOzJXZ0UMsq+xdk3+QJJFMbpR6eAAaIBO10hkJgnvgu\n3HLqB76UnXVDMv8L/jqme99dvVkZynz+/2Xdu2a+GQyXJp9LaLW1cWqyq6CQoJKb\nVegMPvKPEwKBgQC8SWTGEwFm/jcZAsDu4xTcrVa2Oq8L+bubqqtJBTzj7ykmdN5z\nR/HKbTPAxA4gPlRWVlUE2AFMQxo/kYHvG3bGhELSUGdTA69FEjwwQngGUiqc4XXj\nkp8N+t4KuFjIFB6oOTanZUDXSy7Bs3CsoDPoAlUguAJuXHxYM1F1eGcYBQKBgF1q\nGXvtYpdxLAVc/PGvXGzJa/L450PdnSlp54lbw8NyIw2cIuzAjTr1384+m8zkHNgS\ncoh+wKYGETGEAmUxn5rBebd2GpRpJ+5z9yw8GzRzbh1XiRzrVNeltSLlkHpTXlCm\nvk9NDo0eEF3mZ1OYzlmp+UwJ6qZslcPF/8DXa3dPAoGATXRTQw5Wp0xcWdmZvprB\nWP7qjXGQ8dGrujgCsx88LS+ulOymwYAaji/AO62y2qPw18m08nNKe/YbQPNZ9y0/\nBthuf+M89fEbbbZHHqH3u11CoyTb0akoU/+vqtfpc+AW2uO7X4izaJerJmy4Zcqq\nuklDUl2xv7RJYPWf1wko4No=\n-----END PRIVATE KEY-----\n",
// //   "client_email": "safecall-recorder@clever-cyclist-460617-c3.iam.gserviceaccount.com",
// //   "client_id": "114224097282188276707",
// //   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
// //   "token_uri": "https://oauth2.googleapis.com/token",
// //   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
// //   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/safecall-recorder%40clever-cyclist-460617-c3.iam.gserviceaccount.com",
// //   "universe_domain": "googleapis.com"
// // }`;

// // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21SZWNvcmQiOnRydWUsInJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJtaiIsImlzcyI6IkFQSVdSVXpyQnJLWEVGNCIsIm5iZiI6MTc0Nzk3OTU1NiwiZXhwIjoxNzQ4MDAxMTU2fQ.pbvdu5_wIGpO3TYtYrVp-cLmRqgdr9Q7-XZJyFAF4DI"; // 발급받은 JWT 토큰 넣기
// // const EGRESS_URL = 'https://cloud.lke.rs/v1/egress/participant';

// // export async function startEgress(roomName: string, identity: string) {
// //   console.log('이그레스 시작 함수 진입');
// //   try {
// //     const resp = await fetch(EGRESS_URL, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': `Bearer ${token}`,  // 토큰에 roomRecord 권한 포함되어야 합니다
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({
// //         room_name: roomName,
// //         identity,
// //         audio_only: true,
// //         gcp_outputs: [
// //           {
// //             bucket: 'safecall-record',
// //             filepath: `${roomName}/${identity}/${Date.now()}.mp3`,
// //             credentials_json: gcpCredentialsJson,
// //           }
// //         ],
// //       }),
// //     });

// //     console.log('Fetch 요청 완료, 상태:', resp.status);
// //     const text = await resp.text();
// //     console.log('응답 텍스트:', text);

// //     try {
// //       const json = JSON.parse(text);
// //       console.log('파싱된 JSON:', json);
// //       return json;
// //     } catch (parseError) {
// //       console.warn('JSON 파싱 실패:', parseError);
// //       console.warn('원본 텍스트:', text);
// //       throw new Error('응답 JSON 파싱 실패');
// //     }
// //   } catch (error) {
// //     console.error('startEgress 에러 발생:', error);
// //     throw error;
// //   }
// // }

// // export async function stopEgress(egressId: string) {
// //   const stopUrl = `https://cloud.lke.rs/v1/egress/${egressId}/stop`;
// //   console.log('이그레스 중단 함수 진입:', stopUrl);
// //   try {
// //     const resp = await fetch(stopUrl, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': `Bearer ${token}`,
// //         'Content-Type': 'application/json',
// //       },
// //     });

// //     console.log('stopEgress 요청 완료, 상태:', resp.status);
// //     const json = await resp.json();
// //     console.log('stopEgress 응답 JSON:', json);
// //     return json;
// //   } catch (error) {
// //     console.error('stopEgress 에러 발생:', error);
// //     throw error;
// //   }
// // }

// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';

// const CLOUD_RUN_URL = 'https://egress-server-699745003469.asia-northeast3.run.app';

// let recordingObj: Audio.Recording | null = null;
// let isRecordingActive = false;
// let recordTimeout: ReturnType<typeof setTimeout> | null = null;

// function getCurrentTimeString() {
//   const now = new Date();
//   const pad = (n: number) => n.toString().padStart(2, '0');
//   return `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
// }

// export const handleLocalMicRecording = async (roomName: string) => {
//   console.log('[handleLocalMicRecording] 시작 – roomName=', roomName);
//   try {
//     // 이전 녹음 종료
//     if (recordingObj) {
//       const status = await recordingObj.getStatusAsync();
//       if (status.isRecording || status.canRecord) {
//         await recordingObj.stopAndUnloadAsync();
//       }
//       recordingObj = null;
//     }
//     if (recordTimeout) {
//       clearTimeout(recordTimeout);
//       recordTimeout = null;
//     }
//     isRecordingActive = false;

//     // 권한 요청
//     const { status } = await Audio.requestPermissionsAsync();
//     if (status !== 'granted') {
//       console.warn('마이크 권한이 필요합니다!');
//       return;
//     }

//     const recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY;

//     const recordAndSend = async () => {
//       if (isRecordingActive) return;
//       isRecordingActive = true;

//       recordingObj = new Audio.Recording();
//       await recordingObj.prepareToRecordAsync(recordingOptions);
//       await recordingObj.startAsync();

//       // 15초 후 녹음 중지, 파일 처리, Egress API 호출
//       recordTimeout = setTimeout(async () => {
//         try {
//           if (recordingObj) {
//             const status = await recordingObj.getStatusAsync();
//             if (status.isRecording || status.canRecord) {
//               await recordingObj.stopAndUnloadAsync();
//               const uri = recordingObj.getURI();
//               recordingObj = null;
//               isRecordingActive = false;

//               if (uri) {
//                 // 로컬에 저장된 파일을 base64로 읽어 서버 전송 가능
//                 const base64Audio = await FileSystem.readAsStringAsync(uri, {
//                   encoding: FileSystem.EncodingType.Base64,
//                 });

//                 console.log('[Egress] fetch 호출 직전');
//                 try {
//                   const resp = await fetch(`${CLOUD_RUN_URL}/start-recording`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ roomName }),
//                   });
//                   const json = await resp.json();
//                   console.log('Egress API 호출 완료:', json);
//                   console.log('[Egress] fetch 응답 직후, status=', resp.status);
//                 } catch (e) {
//                   console.error('Egress 호출 실패:', e);
//                 }

//                 // ② (옵션) 로컬 파일 저장/업로드 로직
//                 const timeStr = getCurrentTimeString();
//                 const audioFileName = `audio_${timeStr}.m4a`;
//                 const audioPath = FileSystem.documentDirectory + audioFileName;
//                 try {
//                   await FileSystem.writeAsStringAsync(audioPath, base64Audio, {
//                     encoding: FileSystem.EncodingType.Base64,
//                   });
//                   console.log('로컬 오디오 파일 저장 완료:', audioPath);
//                 } catch (e) {
//                   console.error('오디오 파일 저장 실패:', e);
//                 }

//                 // 임시 파일 삭제
//                 await FileSystem.deleteAsync(uri, { idempotent: true });
//               }
//             }
//           }
//         } catch (e) {
//           console.error('녹음 처리 중 에러:', e);
//           isRecordingActive = false;
//         }
//         recordAndSend();
//       }, 15000);
//     };

//     recordAndSend();
//   } catch (err) {
//     console.error('로컬 마이크 녹음 처리 에러:', err);
//   }
// };

// // 녹음 모듈 내부에 추가 (recordingObj, recordTimeout 등은 기존 변수 그대로 사용)

// export const stopLocalMicRecording = async () => {
//   try {
//     if (recordTimeout) {
//       clearTimeout(recordTimeout);
//       recordTimeout = null;
//     }
//     if (recordingObj) {
//       const status = await recordingObj.getStatusAsync();
//       if (status.isRecording || status.canRecord) {
//         await recordingObj.stopAndUnloadAsync();
//       }
//       recordingObj = null;
//     }
//     isRecordingActive = false;
//     console.log('[녹음] 로컬 녹음 중지 완료');
//   } catch (e) {
//     console.error('[녹음] 중지 실패:', e);
//   }
// };

// livekitIntegration.tsx
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
