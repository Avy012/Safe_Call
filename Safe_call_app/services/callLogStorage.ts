import AsyncStorage from '@react-native-async-storage/async-storage';

const CALL_LOG_KEY = 'callLogs';


export const saveCallLog = async (log: any) => {
  const cleanProfile = typeof log.profile === 'string' ? log.profile.trim() : '';
  const userId = log.userId || null;
  
  const updatedLog = {
    ...log,
    userId,
    profile: cleanProfile,
  };

  const existing = await AsyncStorage.getItem(CALL_LOG_KEY);
  const logs = existing ? JSON.parse(existing) : [];
  logs.unshift(updatedLog); // newest first
  await AsyncStorage.setItem(CALL_LOG_KEY, JSON.stringify(logs));
};

export const getCallLogs = async () => {
  const logs = await AsyncStorage.getItem(CALL_LOG_KEY);
  return logs ? JSON.parse(logs) : [];
};
