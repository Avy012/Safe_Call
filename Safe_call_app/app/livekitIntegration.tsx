import { Room, createLocalTracks, createLocalAudioTrack } from 'livekit-client';

const connectToRoom = async (url: string, token: string) => {
  try {
    // 로컬 트랙을 생성합니다 (예: 오디오, 비디오)
    const tracks = await createLocalTracks({
      audio: true,
      video: false,  // 비디오 사용 여부에 따라 true/false 설정
    });

    // Room 객체 생성 후 서버에 연결
    const room = new Room();
    await room.connect(url, token);  // 'room.connect()'로 서버 연결

    // 생성된 트랙을 room에 추가
    tracks.forEach(track => room.localParticipant.publishTrack(track));

    console.log('Connected to room:', room.name);

    // 트랙 구독
    room.on('trackSubscribed', (track) => {
        if (track.kind === 'audio' && track.mediaStream) {  // mediaStream이 undefined일 수 있음을 고려
            const mediaStream = track.mediaStream;
            handleAudioStream(mediaStream);
        } else {
            console.error('MediaStream is undefined');
        }
    });
  } catch (error) {
    console.error('Error connecting to LiveKit room:', error);
  }
};

export const handleAudioStream = (mediaStream: MediaStream) => {
  const mediaRecorder = new MediaRecorder(mediaStream);
  let audioChunks: Blob[] = [];

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    sendAudioToServer(audioBlob);
  };

  mediaRecorder.start();

  setInterval(() => {
    mediaRecorder.stop();
    mediaRecorder.start();
  }, 10000);  // 10초마다 오디오 캡처
};

const sendAudioToServer = (audioBlob: Blob) => {
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
