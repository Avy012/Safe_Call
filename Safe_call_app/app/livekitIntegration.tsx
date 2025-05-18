import AudioRecord from 'react-native-audio-record';

// 오디오 스트림 처리 함수
export const handleAudioStream = (mediaStream: MediaStream) => {
    console.log('핸들러 진입');
  // MediaStream에서 오디오 트랙을 추출
  const audioTrack = mediaStream.getAudioTracks()[0];
  if (!audioTrack) {
    console.error('No audio track found!');
    return;
  }

  // 오디오 녹음을 위한 설정
  const options = {
    sampleRate: 16000, // 오디오 샘플링 주파수 (예시: 16kHz)
    channels: 1,       // 모노 채널
    bitsPerSample: 16, // 비트 깊이
    wavFile: 'audio.wav'
  };

  // 오디오 레코더 초기화
  AudioRecord.init(options);
  AudioRecord.start(); // 오디오 녹음 시작

  // 10초마다 오디오 캡처 및 서버로 전송
  setInterval(async () => {
    try {
      const audioData = await AudioRecord.stop(); // 현재 녹음된 데이터 가져오기
      const audioBlob = new Blob([audioData], { type: 'audio/wav' }); // Blob 형식으로 변환

      // 서버로 오디오 데이터 전송
      sendAudioToServer(audioBlob);
      
      // 오디오 녹음 다시 시작
      AudioRecord.start();
    } catch (error) {
      console.error('Error during audio capture:', error);
    }
  }, 10000);  // 10초마다 캡처
};

// 서버로 오디오 전송
const sendAudioToServer = (audioBlob: Blob) => {
    console.log('sendAudioToServer 함수 진입');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Audio uploaded successfully:', data);
    })
    .catch((error) => {
      console.error('Error uploading audio:', error);
    });
};
