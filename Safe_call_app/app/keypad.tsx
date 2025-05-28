import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/constants/icons';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/services/firebaseConfig'; // ✅ adjust path if needed

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

      // 🔍 1. Find receiver by phone number
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
      const callerDoc = await getDoc(doc(db, 'users', callerId));
      if (!callerDoc.exists()) throw new Error('Caller 정보 없음');
      const callerData = callerDoc.data();

      const roomName = `room_${callerId}_${receiverId}`;

      // 🔐 3. Get token from backend (with safe handling)
      const res = await fetch('https://safe-call.onrender.com/get-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: receiverId, roomName }),
      });

      const rawText = await res.text();

      let token: string;
      try {
        const parsed = JSON.parse(rawText);
        token = parsed.token;
        if (!token) throw new Error('No token in response');
      } catch (err) {
        console.error('❌ Token 파싱 실패:', rawText);
        Alert.alert('오류', '토큰을 받아오지 못했습니다.');
        return;
      }

      // 💾 4. Save call request to Firestore
      await setDoc(doc(db, 'calls', receiverId), {
        name: callerData.name,
        phone: callerData.phone,
        profilePic: callerData.profilePic ?? '',
        callId: callerId,
        token,
        roomName,
      });

      // 🧭 5. Navigate to room
      router.push({
        pathname: '/generate_room',
        params: {
          token,
          name: receiverData.name,
          profilePic: encodeURIComponent(receiverData.profilePic ?? ''),
          phone: phoneNumber,
        },
      });

    } catch (error) {
      console.error('📞 전화 연결 실패:', error);
      Alert.alert('통화 실패', '전화 연결 중 문제가 발생했습니다.');
    }
  };

  return (
    <View className="flex-1 items-center justify-end bg-white">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-4 p-2 bg-white rounded-lg z-10">
        <Text className="text-5xl text-primary-1000">←</Text>
      </TouchableOpacity>

      {/* Phone Number */}
      <Text className="text-3xl mb-36">{phoneNumber}</Text>

      {/* Keypad */}
      <View className="flex-row flex-wrap w-[330px] h-[280px] justify-between mb-5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
          <TouchableOpacity
            key={num}
            className="w-[100px] h-[55px] mb-4 rounded-full bg-white-350  items-center"
            onPress={() => handleButtonPress(num)}
          >
            <Text className="text-2xl">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Actions */}
      <View className="relative w-full items-center mb-16">
        {/* Call Button */}
        <ImageBackground source={icons.callbutton} className="w-[55px] h-[55px] mx-2 rounded-xl overflow-hidden absolute left-1/2 -translate-x-1/2">
          <TouchableOpacity onPress={handleCall} className="w-full h-full" />
        </ImageBackground>

        {/* Delete Button */}
        <ImageBackground source={icons.backspace} className="w-[50px] h-[50px] rounded-xl overflow-hidden ml-60">
          <TouchableOpacity onPress={handleDelete} className="w-full h-full" />
        </ImageBackground>
      </View>
    </View>
  );
};

export default Keypad;
