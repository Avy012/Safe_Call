import AsyncStorage from '@react-native-async-storage/async-storage';

const CALL_LOG_KEY = 'callLogs';

export const saveCallLog = async ({
  callerId,
  calleeId,
  callerName,
  calleeName,
  callerPhone,
  calleePhone,
  callerProfile,
  calleeProfile,
  isCaller,
  duration,
  startTime,
  type,
  summary = '',
  isScam = 'false', // ✅ Add this
}: {
  callerId: string;
  calleeId: string;
  callerName: string;
  calleeName: string;
  callerPhone: string;
  calleePhone: string;
  callerProfile: string;
  calleeProfile: string;
  isCaller: boolean;
  duration: number;
  startTime: string;
  type: '발신' | '수신';
  summary?: string;
  isScam?: string; // ✅ Add this
}) => {
  const cleanCallerProfile = typeof callerProfile === 'string' ? callerProfile.trim() : '';
  const cleanCalleeProfile = typeof calleeProfile === 'string' ? calleeProfile.trim() : '';

  const log = {
    userId: isCaller ? callerId : calleeId, // the current user's ID
    type,
    duration,
    startTime,
    summary,
    isScam, // ✅ Add this line

    // target for UI display
    name: isCaller ? calleeName : callerName,
    phone: isCaller ? calleePhone : callerPhone,
    profile: isCaller ? cleanCalleeProfile : cleanCallerProfile,

    // always include both sides for display logic
    fromName: callerName,
    fromPhone: callerPhone,
    fromProfile: cleanCallerProfile,
    toName: calleeName,
    toPhone: calleePhone,
    toProfile: cleanCalleeProfile,
  };

  const existing = await AsyncStorage.getItem(CALL_LOG_KEY);
  const logs = existing ? JSON.parse(existing) : [];
  logs.unshift(log); // add to top
  await AsyncStorage.setItem(CALL_LOG_KEY, JSON.stringify(logs));
};

export const getCallLogs = async () => {
  const logs = await AsyncStorage.getItem(CALL_LOG_KEY);
  return logs ? JSON.parse(logs) : [];
};
