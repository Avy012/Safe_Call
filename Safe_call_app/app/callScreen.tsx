import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const CallScreen = () => {
  const router = useRouter();

  const handleHangup = () => {
    // TODO: LiveKit disconnect
    router.replace('/keypad');
  };

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white text-3xl mb-10">통화 중...</Text>
      <TouchableOpacity onPress={handleHangup} className="bg-red-600 px-6 py-3 rounded-full">
        <Text className="text-white text-lg">끊기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CallScreen;
