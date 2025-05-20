import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ScamAlertBanner = () => {
  return (
    <View className="bg-red-500 rounded-2xl mx-4 mt-4 px-4 py-3 flex-row items-center shadow-lg shadow-red-300">
      <MaterialIcons name="warning" size={24} color="white" className="mr-2" />
      <View className="flex-1">
        <Text className="text-white font-bold text-base">⚠️ 경고  </Text>
        <Text className="text-white text-sm">스캠 의심 전화입니다.</Text>
      </View>
    </View>
  );
};

export default ScamAlertBanner;
