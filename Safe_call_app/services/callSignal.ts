// callSignal.ts (sender)
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const signalIncomingCall = async (calleeId: string, callerInfo: any) => {
  await setDoc(doc(db, 'calls', calleeId), {
    from: callerInfo,
    status: 'incoming',
    timestamp: Date.now(),
  });
};
