import { View, Text, TouchableOpacity, Image,StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function CallScreen() {
  const { name, phone } = useLocalSearchParams();
  const router = useRouter();

  const displayName = name || 'Unknown';
  const displayPhone = phone || '번호 없음';

  return (
    <View className="flex-1 bg-black justify-between items-center pt-16 pb-10 px-4">
      {/* 프로필 이미지 자리 */}
      <View className="items-center">
        <View className="w-28 h-28 rounded-full bg-gray-700 mb-4" />
        <Text className="text-white text-2xl font-semibold">{displayName}</Text>
        <Text className="text-gray-400 text-sm mt-1">{displayPhone}</Text>
      </View>

      {/* 통화 시간 */}
      <Text className="text-white text-base mt-6">00:12</Text>

      {/* 기능 버튼 3개 */}
      <View className="flex-row justify-around w-full px-6 mt-12">
        <TouchableOpacity className="items-center" onPress={() => alert('Muted')}>
          <Image source={require('../assets/icons/mute.png')} // ← 본인 아이콘 이미지 경로
            style={styles.icon}
          />
          <View className="w-14 h-14 rounded-full bg-gray-600 justify-center items-center mb-2" />
          <Text className="text-white text-sm">Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => alert('Speaker On')}>
          <Image source={require('../assets/icons/speaker.png')} // ← 본인 아이콘 이미지 경로
            style={styles.icon}
          />
          <View className="w-14 h-14 rounded-full bg-gray-600 justify-center items-center mb-2" />
          <Text className="text-white text-sm">Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => alert('Video')}>
          <Image source={require('../assets/icons/video.png')} // ← 본인 아이콘 이미지 경로
            style={styles.icon}
          />
          <View className="w-14 h-14 rounded-full bg-gray-600 justify-center items-center mb-2" />
          <Text className="text-white text-sm">Video</Text>
        </TouchableOpacity>
      </View>

      {/* 통화 종료 버튼 */}
      <TouchableOpacity
        className="bg-red-600 w-16 h-16 rounded-full justify-center items-center mt-12"
        onPress={() => router.back()}
      >
        <Text className="text-white font-bold">End</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  
  icon:{
    width: 30,
    height: 30,
    marginRight: 12,
  },
  
});
