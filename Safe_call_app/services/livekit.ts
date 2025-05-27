import axios from 'axios';

export const getLiveKitToken = async (
  identity: string,
  name?: string,
  room: string = 'safe-call-room'
): Promise<string | null> => {
  try {
    const res = await axios.post('https://safe-call.onrender.com/get-token', {
      identity,
      name: name || identity,
      room,
    });

    if (res.data?.token) {
      console.log('✅ LiveKit token received:', res.data.token);
      return res.data.token;
    }

    console.warn('❌ Token not returned:', res.data);
    return null;
  } catch (err: any) {
    console.error('❌ Axios error:', err.message);
    return null;
  }
};
