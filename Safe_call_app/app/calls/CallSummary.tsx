import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function CallSummary() {
  const { name,  date, type, duration, userId, profile, summary, isScam  } = useLocalSearchParams();
  const router = useRouter();
  const profileURL = typeof profile === 'string' ? profile : null;

  const params = useLocalSearchParams();
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;

  const scamLikely = String(isScam).toLowerCase() === 'true';


  const formatPhoneNumber = (num: string) => {
    if (!num || num.length !== 11) return num; // return as-is if invalid
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  };

  console.log('🧪 isScam param:', isScam);



  const formattedDate = date
    ? new Date(date as string).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '날짜 없음';

  const durationSec = Number(duration) || 0;
  const durationText = `${Math.floor(durationSec / 60)}분 ${durationSec % 60}초`;

  console.log('📥 Params:', {
  profile,
  decodedProfile: typeof profile === 'string' ? decodeURIComponent(profile) : null,
});

  return (
    <View className="flex-1 bg-white px-6 pt-12 pb-6 justify-between">
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity onPress={() => router.replace('/calls')} className="absolute top-4 left-4 p-2 bg-white rounded-lg z-10">
        <Text className="text-5xl text-primary-1000">←</Text>
      </TouchableOpacity>

      <View className="items-center pt-20 mb-4">
        {/* 프로필 이미지 */}
        <Image
          source={
            profileURL
              ? { uri: profileURL, cache: 'force-cache' }
              : require('../../assets/images/default_profile.jpg')
          }
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 20,
            backgroundColor: '#ccc',
          }}
          resizeMode="cover"
          onLoadStart={() => console.log('⏳ Loading profile image...')}
          onLoad={() => console.log('✅ Profile image loaded')}
          onError={(e) => console.warn('❌ Failed to load image:', profileURL, e.nativeEvent.error)}
        />

        {/* 이름 */}
        <Text className="text-3xl font-semibold">{name}</Text>

        {/* 전화번호 */}
        {phone && (
          <Text className="text-lg font-medium text-blue-700 mt-3">{formatPhoneNumber(phone)}</Text>
        )}
      </View>

        {/* 요약정보 */}
      <View className="px-4 py-5 border-b border-gray-200 items-center">
        <Text className="text-xl font-semibold text-gray-900 mb-2">AI 요약</Text>
        <Text className="text-base text-gray-900 text-center">{summary || '요약 없음'}</Text>
      </View>

      {/* 스캠 경고 */}
      {scamLikely && (
        <View className="mt-4 bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <Text className="text-red-800 font-bold text-center">🚨 이 통화는 스캠일 수 있습니다.</Text>
        </View>
      )}




      {/* 통화 정보 섹션 */}
      <View className="space-y-6">
        <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-lg text-gray-600">통화 날짜</Text>
          <Text className="text-lg text-gray-900">{formattedDate}</Text>
        </View>
        <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-lg text-gray-600">통화 유형</Text>
          <Text className="text-lg text-gray-900">{type}</Text>
        </View>
        <View className="flex-row justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-lg text-gray-600">통화 시간</Text>
          <Text className="text-lg text-gray-900">{durationText}</Text>
        </View>
      </View>
    </View>
  );
}
