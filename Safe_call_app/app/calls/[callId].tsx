import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, Linking,FlatList, } from 'react-native';
import React, { useState } from 'react';
import { Alert } from 'react-native';

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


export default function CallDetail() {
  const { name, summary, phone } = useLocalSearchParams();
  const router = useRouter();
  const [blocked, setBlocked] = useState(false);
  const profileImage = profileImages[String(name)] || 'https://randomuser.me/api/portraits/lego/1.jpg';

  const handleCall = () => {
  if (phone) {
    router.push({
      pathname: '/keypad',
      params: {
        phone,
      },
    });
  }
};
      const handleBlock = () => {
      setBlocked(true);
      Alert.alert('차단 완료', `${name}님이 차단되었습니다.`);
    };

    const handleDelete = () => {
  Alert.alert('삭제 완료', '연락처가 삭제되었습니다.');
};
   // 예시: summary를 문자열 대신 배열로 받도록 수정 (실제 데이터 연결 시 여기를 props나 API로 대체)
  const callHistory: { date: string; type: string; duration: string }[] = [
    { date: '2025-05-18', type: '수신', duration: '3분' },
    { date: '2025-05-15', type: '발신', duration: '6분' },
    { date: '2025-05-10', type: '부재중', duration: '-' },
  ];
  return (
    <View className="flex-1 bg-white px-6 pt-12 pb-6 justify-between">
      <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-4 p-2 bg-white rounded-lg z-10">
       <Text className="text-5xl text-primary-1000">←</Text>
       </TouchableOpacity>
       <View className="items-end mt-4">
         <TouchableOpacity
              className="bg-gray-0 py-0 rounded-full mb-0 items-center w-1/4"
              onPress={handleDelete}
            > <Text className="text-white font-semibold text-lg">❌</Text>
            </TouchableOpacity>
            </View> 
      {/* 프로필 이미지 + 이름  */}
      <View className="items-center pt-0 mb-4">
        <Image
          source={{ uri: profileImage }}
          className="w-28 h-28 rounded-full mb-5"
        />
        <Text className="text-3xl font-semibold">{name}</Text>
        {phone && (
          <Text className="text-lg font-medium text-blue-700 mt-3">
           {phone}
          </Text>
        )}
        </View>

        {/* 최근 통화 목록 리스트 */}
      <View className=" w-full px-2">
        <Text className="text-lg font-bold mb-6 text-center">최근 통화 목록</Text>
        <FlatList
          data={callHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="flex-row justify-between px-4 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-800">{item.date}</Text>
              <Text className="text-base text-gray-800">{item.type}</Text>
              <Text className="text-base text-gray-800">{item.duration}</Text>
            </View>
          )}
        />
      </View>
      

      {/* 버튼 영역 */}
      <View className="flex-row justify-center gap-4 mt-10">
        <TouchableOpacity
          className="bg-[#30557f] py-4 rounded-full mb-4 items-center w-1/2"
          onPress={handleCall}
        >
          <Text className="text-white font-semibold text-lg">전화 걸기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 py-4 rounded-full mb-4 items-center w-1/2"
          onPress={handleBlock}
        >
          <Text className="text-white font-semibold text-lg"> <Text className="text-white font-semibold text-lg">
          {blocked ? '차단됨' : '차단하기'}
        </Text>
        </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
