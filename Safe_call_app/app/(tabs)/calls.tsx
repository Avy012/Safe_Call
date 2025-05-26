import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { getCallLogs } from '@/services/callLogStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Calls() {
  const router = useRouter();
  const [callList, setCallList] = useState<any[]>([]);
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({});
  const defaultProfile = require('../../assets/images/default_profile.jpg');

  useEffect(() => {
    const loadLogs = async () => {
      const logs = await getCallLogs();
      setCallList(logs);
    };
    loadLogs();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary px-4 py-4">
        <Text className="text-white text-2xl font-bold">통화 기록</Text>
      </View>

      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem('callLogs');
          setCallList([]); // clear UI
          console.log('🗑️ 통화 기록 삭제됨');
        }}
        className="bg-primary px-4 py-2 rounded-full m-4 self-end"
      >
        <Text className="text-white font-semibold">🗑️ 기록 삭제</Text>
      </TouchableOpacity>


      <FlatList
        data={callList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const profile = (item.profile || '').trim();
          const isValidURL = profile.startsWith('http') && !errorImages[profile];

          console.log('🧪 From call log:', profile);
          console.log('📦 Item in call log:', item); // ADD THIS TEMP LOG

          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/calls/CallSummary',
                  params: {
                    name: item.name,
                    phone: item.phone,
                    profile: encodeURIComponent(profile),
                    date: item.startTime,
                    type: item.type,
                    duration: String(item.duration),
                    summary: item.summary,
                    userId: item.userId,
                  },
                })
              }
              className="flex-row items-center px-4 py-3 border-b border-gray-200"
            >
              <Image
                source={isValidURL ? { uri: profile } : defaultProfile}
                onError={() =>
                  setErrorImages((prev) => ({
                    ...prev,
                    [profile]: true,
                  }))
                }
                onLoad={() => console.log('✅ Image loaded successfully')}
                style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: 'gray' }}
                resizeMode="cover"
              />
              <View className="ml-4">
                <Text className="text-lg font-medium">{item.name}</Text>
                <Text className="text-gray-500">
                  {new Date(item.startTime).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>

              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
