import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { router } from 'expo-router';
import { registerFCMToken } from '@/services/firebaseSetup';

export default function Index() {
  useEffect(() => {
    registerFCMToken();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('✅ Firebase user:', user);
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/before_login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold">🔄 Redirecting...</Text>
    </View>
  );
}
