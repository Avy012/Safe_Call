import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Image } from 'react-native'; // ✅ Image 추가
import React from 'react';

const profileImages: Record<string, string> = {
  'Alice Johnson': 'https://randomuser.me/api/portraits/women/10.jpg',
  'Bob Smith': 'https://randomuser.me/api/portraits/men/11.jpg',
  'Charlie Brown': 'https://randomuser.me/api/portraits/men/12.jpg',
  'David Williams': 'https://randomuser.me/api/portraits/men/13.jpg',
  'Emma Watson': 'https://randomuser.me/api/portraits/women/14.jpg',
  'Olivia Davis': 'https://randomuser.me/api/portraits/women/15.jpg',
  'Liam Thompson': 'https://randomuser.me/api/portraits/men/16.jpg',
  'Sophia Miller': 'https://randomuser.me/api/portraits/women/17.jpg',
  'James Anderson': 'https://randomuser.me/api/portraits/men/18.jpg',
  'Isabella Moore': 'https://randomuser.me/api/portraits/women/19.jpg',
  'Noah Taylor': 'https://randomuser.me/api/portraits/men/20.jpg',
  'Mia Clark': 'https://randomuser.me/api/portraits/women/21.jpg',
  'Elijah Lewis': 'https://randomuser.me/api/portraits/men/22.jpg',
  'Ava Hall': 'https://randomuser.me/api/portraits/women/23.jpg',
  'Lucas Young': 'https://randomuser.me/api/portraits/men/24.jpg'
};

export default function CallSummary() {
  const { name, phone, date, type, duration, profile,summary } = useLocalSearchParams();
  const router = useRouter();
  const profileImage = profileImages[String(name)] || 'https://randomuser.me/api/portraits/lego/1.jpg';

  return (
    <View className="flex-1 bg-white px-6 pt-12 pb-6 justify-between">
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-4 p-2 bg-white rounded-lg z-10">
        <Text className="text-5xl text-primary-1000">←</Text>
      </TouchableOpacity>

      <View className="items-center pt-20 mb-4">
        {/* 프로필 이모지 */}
              <Text
          className="text-7xl mb-8"
          style={{ lineHeight: 90, fontSize: 64 }}
        >
          {profile || '👤'}
        </Text>


        {/* 이름 */}
        <Text className="text-3xl font-semibold">{name}</Text>

        {/* 전화번호 */}
        {phone && (
          <Text className="text-lg font-medium text-blue-0 mt-3">
            {phone}
          </Text>
        )}
      </View>


      {/* 요약 */}
      <View className="mt-0 mb-10 items-center">
      <Text className="text-base text-blue-700 italic bg-blue-50 px-3 py-2 rounded-xl shadow-sm">
  {summary}
</Text>
      </View>

      {/* 통화 정보 섹션 */}
      <View className="space-y-6">
        <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-lg text-gray-600">통화 날짜</Text>
          <Text className="text-lg text-gray-900">{date}</Text>
        </View>
        <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-lg text-gray-600">통화 유형</Text>
          <Text className="text-lg text-gray-900">{type}</Text>
        </View>
        <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-lg text-gray-600">통화 시간</Text>
          <Text className="text-lg text-gray-900">{duration}</Text>
        </View>
      </View>
    </View>
  );
}
