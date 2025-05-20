import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

const callList = [
  {
    id: '1',
    name: 'Alice',
    profile: '👩',
    summary: 'Talked about bank account issues',
  },
  {
    id: '2',
    name: 'Bob',
    profile: '👨',
    summary: 'Asked for verification code',
  },
];

export default function Calls() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary px-4 py-4">
        <Text className="text-white text-2xl font-bold">통화 기록</Text>
      </View>

      <FlatList
        data={callList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
         <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/calls/CallSummary',
              params: {
                name: item.name,
                phone: '010-1234-5678', // 전화번호 예시. 필요 시 item.phone으로 확장 가능
                profile: item.profile,
                date: '2025-05-20',
                type: '수신',
                duration: '3분 21초',
                summary:item.summary
              },
            })
          }
          className="flex-row items-center px-4 py-3 border-b border-gray-200"
        >
          <Text className="text-2xl mr-3">{item.profile}</Text>
          <View>
            <Text className="text-lg font-medium">{item.name}</Text>
            <Text className="text-gray-500">{item.summary}</Text>
          </View>
        </TouchableOpacity>

                )}
              />
            </View>
  );
}
