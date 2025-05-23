import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ScamAlertBanner = ({ phoneNumber }: { phoneNumber: string }) => {
  const handleBlock = () => {
    // 여기에 차단 처리 로직을 넣을 수 있어요 (예: DB 저장, 상태 업데이트 등)
    Alert.alert('번호 차단됨', `${phoneNumber} 이(가) 차단되었습니다.`);
  };

  return (
    <View className="bg-red-500 rounded-2xl mx-4 mt-4 px-4 py-3 flex-row items-center shadow-lg shadow-red-300">
      <MaterialIcons name="warning" size={24} color="white" className="mr-2" />

      <View className="flex-1 mr-2">
        <Text className="text-white font-bold text-base">⚠️ 경고</Text>
        <Text className="text-white text-sm">스캠 의심 전화입니다.</Text>
      </View>

      <TouchableOpacity
        onPress={handleBlock}
        className="bg-white px-3 py-1.5 rounded-xl"
      >
        <Text className="text-red-500 font-semibold text-sm">번호 차단</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScamAlertBanner;
