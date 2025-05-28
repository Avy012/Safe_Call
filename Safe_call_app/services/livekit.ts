import axios from 'axios';

export const getLiveKitToken = async (
  identity: string,
  name?: string,
  room: string = 'safe-call-room',
  receiver_id?: string
): Promise<string | null> => {
  try {
    const payload = {
      identity,
      name: name || identity,
      room,
      receiver_id, // ✅ REQUIRED by your backend
    };

    const res = await axios.post('https://safe-call.onrender.com/get-token', payload, {
      headers: {
        'Content-Type': 'application/json', // ✅ Make sure FastAPI reads JSON correctly
      },
    });

    if (res.data?.token) {
      console.log('✅ LiveKit token received:', res.data.token);
      return res.data.token;
    }

    console.warn('❌ Token not returned:', res.data);
    return null;
  } catch (err: any) {
    console.error('❌ Axios error:', err.message);
    console.error('❌ Full error:', err.response?.data || err);
    return null;
  }
};
