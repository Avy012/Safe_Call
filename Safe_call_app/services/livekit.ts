import axios from 'axios';

export const getLiveKitToken = async (
  identity: string,
  name?: string,
  room: string = 'safe-call-room'
): Promise<string | null> => {
  try {
    const res = await axios.post('http://192.168.219.105:8000/get-token', {// 여기에 사용 네트워크 ip 넣기! 
      identity,
      name: name || identity,
      room,
    });

    if (res.data?.token) return res.data.token;

    console.warn('❌ Token not returned:', res.data);
    return null;
  } catch (err: any) {
    console.error('❌ Axios error:', err.message);
    return null;
  }
};
