import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/constants/icons';

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
    if (!phoneNumber) return console.error('전화번호가 비어있습니다.');

    try {
      const response = await fetch('https://your-server.com/get-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: phoneNumber }),
      });

      const { token } = await response.json();
      console.log('통화 연결됨!', token);
    } catch (error) {
      console.error('전화 연결 실패', error);
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
          <TouchableOpacity onPress={() => router.push('./callScreen')} className="w-full h-full" />

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
