import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

const startCall = async ({
  caller,
  calleeUid,
  token,
  roomName,
}: {
  caller: { name: string; phone: string; uid: string }; // ✅ add uid here
  calleeUid: string;
  token: string;
  roomName: string;
}) => {
  await setDoc(doc(db, 'calls', calleeUid), {
    name: caller.name,
    phone: caller.phone,
    token,
    roomName,
    callId: caller.uid, // ✅ now works!
  });
};
