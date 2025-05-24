import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig'; // Update with your actual path
import { useAuth } from '../context/UserContext'; // Your auth context for current user

export default function IncomingCallScreen() {
  const { name, phone, token, roomName } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth(); // get logged-in user

  const displayName = name || 'Unknownnnn';
  const displayPhone = phone || '번호 없음';

  if (!user) {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text>🔒 사용자 정보를 불러오는 중...</Text>
    </View>
  );
}


  const handleReject = async () => {
    if (user?.uid) {
      await deleteDoc(doc(db, 'calls', user.uid));
    }
    router.back();
  };

  const handleAccept = async () => {
    if (user?.uid) {
      await deleteDoc(doc(db, 'calls', user.uid));
    }

    router.push({
      pathname: '/calls/activeCall',
      params: {
        token: token as string,
        roomName: roomName as string,
      },
    });
  };

  return (
    <View className="flex-1 bg-black justify-between items-center pb-12 px-4">
      {/* 상단 텍스트 */}
      <View className="items-center">
        <Text className="text-gray-300 text-lg mb-4 pt-20">전화가 왔습니다</Text>

        {/* 프로필 이미지 자리 */}
        <View className="w-28 h-28 rounded-full bg-gray-700 mb-4" />

        <Text className="text-white text-3xl font-semibold">{displayName}</Text>
        <Text className="text-gray-400 text-lg mt-1">{displayPhone}</Text>
      </View>

      {/* 수락/거절 버튼 */}
      <View className="flex-row justify-around w-full pb-12 px-12 mt-16">
        {/* 거절 */}
        <TouchableOpacity className="items-center" onPress={handleReject}>
          <Image
            source={require('../assets/icons/deny.png')}
            style={styles.icon}
          />
          <Text className="text-white text-sm pt-8">거절</Text>
        </TouchableOpacity>

        {/* 수락 */}
        <TouchableOpacity className="items-center" onPress={handleAccept}>
          <Image
            source={require('../assets/icons/callButton.png')}
            style={styles.icon}
          />
          <Text className="text-white text-sm pt-8">받기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 65,
    height: 65,
    marginRight: 12,
  },
});
