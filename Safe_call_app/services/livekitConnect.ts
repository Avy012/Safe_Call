import { Room } from 'livekit-client';

let roomInstance: Room | null = null;

export const connectToRoom = async (token: string) => {
  try {
    const room = new Room();

    await room.connect('wss://safecall-ozn2xsg6.livekit.cloud', token); // 클라우드 주소!

    roomInstance = room;

    console.log('✅ Connected to LiveKit room as', room.localParticipant.identity);

    // Optional: Participant joined listener
    room.on('participantConnected', (participant) => {
      console.log('👤 Participant joined:', participant.identity);
    });

    return room;
  } catch (err) {
    console.error('❌ Failed to connect to LiveKit room:', err);
    throw err;
  }
};

export const getRoomInstance = () => roomInstance;
