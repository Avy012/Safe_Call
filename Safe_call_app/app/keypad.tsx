import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/constants/icons';
import { getTokenAndConnect } from '@/utils/livekitClient';

const Keypad: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleButtonPress = (num: string) => setPhoneNumber((prev) => prev + num);
  const handleDelete = () => setPhoneNumber((prev) => prev.slice(0, -1));

  const handleCall = async () => {
    if (!phoneNumber) return console.warn('전화번호가 비어있습니다.');
    const connected = await getTokenAndConnect(phoneNumber);
    if (connected) {
      router.push('/callScreen');
    }
  };

  return (
    <View className="flex-1 items-center justify-end bg-white">
      <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-4 p-2">
        <Text className="text-5xl">←</Text>
      </TouchableOpacity>

      <Text className="text-3xl mb-36">{phoneNumber}</Text>

      <View className="flex-row flex-wrap w-[330px] h-[280px] justify-between mb-5">
        {['1','2','3','4','5','6','7','8','9','*','0','#'].map((num) => (
          <TouchableOpacity key={num} onPress={() => handleButtonPress(num)} className="w-[100px] h-[55px] mb-4 items-center justify-center bg-gray-100 rounded-full">
            <Text className="text-2xl">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="relative w-full items-center mb-16">
        <ImageBackground source={icons.callbutton} className="w-[55px] h-[55px] absolute left-1/2 -translate-x-1/2">
          <TouchableOpacity onPress={handleCall} className="w-full h-full" />
        </ImageBackground>
        <ImageBackground source={icons.backspace} className="w-[50px] h-[50px] ml-60">
          <TouchableOpacity onPress={handleDelete} className="w-full h-full" />
        </ImageBackground>
      </View>
    </View>
  );
};

export default Keypad;
