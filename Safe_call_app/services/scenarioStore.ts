import * as SecureStore from 'expo-secure-store';

export const setScenario = async (value: string) => {
  await SecureStore.setItemAsync('scenario', value);
};

export const getScenario = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('scenario');
};

export const resetScenario = async () => {
  await SecureStore.deleteItemAsync('scenario');
};
