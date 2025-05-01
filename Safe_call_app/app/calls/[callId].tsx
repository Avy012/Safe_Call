import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';

export default function CallDetail() {
  const { name, summary, profile } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white p-6">
      <View className="items-center mb-6">
        <Text className="text-6xl">{profile}</Text>
        <Text className="text-2xl font-semibold mt-2">{name}</Text>
      </View>

      <View>
        <Text className="text-lg font-bold mb-2">Call Summary</Text>
        <Text className="text-base text-gray-700">{summary}</Text>
      </View>
    </View>
  );
}
