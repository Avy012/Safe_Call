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
        <Text className="text-white text-2xl font-bold">Recent Calls</Text>
      </View>

      <FlatList
        data={callList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/calls/${item.id}?name=${item.name}&summary=${encodeURIComponent(item.summary)}&profile=${item.profile}`)
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
