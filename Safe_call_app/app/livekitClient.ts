import { createLocalTrack, Room } from 'livekit-client';
import { LiveKitReactNative } from 'livekit-client/react-native';

let room: Room | null = null;

export const getTokenAndConnect = async (identity: string) => {
  try {
    const res = await fetch('https://your-server.com/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity }),
    });
    const { token, url } = await res.json();

    room = new Room();
    await room.connect(url, token, {
      autoSubscribe: true,
    });

    const micTrack = await createLocalTrack({ kind: 'audio' });
    room.localParticipant.publishTrack(micTrack);
    
    return true;
  } catch (error) {
    console.error('LiveKit 연결 실패', error);
    return false;
  }
};
