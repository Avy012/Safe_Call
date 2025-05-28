import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/constants/icons';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/services/firebaseConfig';
import { getLiveKitToken } from '@/services/livekit';

const Keypad: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleButtonPress = (number: string) => {
    setPhoneNumber((prev) => prev + number);
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      Alert.alert('유효하지 않은 번호', '전화번호를 입력해주세요.');
      return;
    }

    try {
      const callerId = auth.currentUser?.uid;
      if (!callerId) {
        Alert.alert('로그인 오류', '로그인 정보가 없습니다.');
        return;
      }

      // 🔍 1. Find receiver by phone
      const q = query(collection(db, 'users'), where('phone', '==', phoneNumber));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        Alert.alert('연락처 없음', '해당 전화번호의 사용자를 찾을 수 없습니다.');
        return;
      }

      const receiverDoc = snapshot.docs[0];
      const receiverId = receiverDoc.id;
      const receiverData = receiverDoc.data();

      // 🔍 2. Get caller data
      const userDoc = await getDoc(doc(db, 'users', callerId));
      if (!userDoc.exists()) throw new Error('Caller 정보 없음');
      const callerData = userDoc.data();

      // 🏷️ 3. Dynamic room name
      const roomName = `room_${callerId}_${receiverId}`;

      // 🔐 4. Get token for caller
      const token = await getLiveKitToken(callerData.phone, roomName, callerData.name);
      if (!token) {
        Alert.alert('오류', '서버로부터 토큰을 가져오지 못했습니다.');
        return;
      }

      // 💾 5. Write call document for callee
      await setDoc(doc(db, 'calls', receiverId), {
        name: callerData.name ?? '이름 없음',
        phone: callerData.phone ?? '알 수 없음',
        profilePic: (callerData.profilePic ?? '').replace(/prrofilePics|profilePiccs/g, 'profilePics'),
        callId: callerId,
        token,
        roomName,
      });

      // 🧭 6. Navigate to call
      router.push({
        pathname: '/generate_room',
        params: {
          token: encodeURIComponent(token),
          name: receiverData.name,
          profilePic: encodeURIComponent((receiverData.profilePic ?? '').replace(/prrofilePics|profilePiccs/g, 'profilePics')),
          phone: phoneNumber,
          userId: receiverId,
          callerId,
        },
      });

    }  catch (error: unknown) {
        const err = error as Error;
        console.error('📞 전화 연결 실패:', err);
        Alert.alert('통화 실패', err.message ?? '전화 연결 중 문제가 발생했습니다.');
      }
  };

  return (
    <View className="flex-1 items-center justify-end bg-white">
      <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-4 p-2 bg-white rounded-lg z-10">
        <Text className="text-5xl text-primary-1000">←</Text>
      </TouchableOpacity>

      <Text className="text-3xl mb-36">{phoneNumber}</Text>

      <View className="flex-row flex-wrap w-[330px] h-[280px] justify-between mb-5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
          <TouchableOpacity
            key={num}
            className="w-[100px] h-[55px] mb-4 rounded-full bg-white-350 items-center"
            onPress={() => handleButtonPress(num)}
          >
            <Text className="text-2xl">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="relative w-full items-center mb-16">
        <ImageBackground source={icons.callbutton} className="w-[55px] h-[55px] mx-2 rounded-xl overflow-hidden absolute left-1/2 -translate-x-1/2">
          <TouchableOpacity onPress={handleCall} className="w-full h-full" />
        </ImageBackground>

        <ImageBackground source={icons.backspace} className="w-[50px] h-[50px] rounded-xl overflow-hidden ml-60">
          <TouchableOpacity onPress={handleDelete} className="w-full h-full" />
        </ImageBackground>
      </View>
    </View>
  );
};

export default Keypad;
