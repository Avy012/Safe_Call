import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router'; 

const Before_Login = ({ navigation }: any) => {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Image source={require('../../assets/images/logo.png')} className="w-24 h-24 mb-6" />
      <Text className="text-2xl font-bold text-primary mb-4">SAFE CALL</Text>

      <TouchableOpacity
        style={{ backgroundColor: '#1E3A5F' }}
        className="w-full h-12 rounded-md items-center justify-center mb-4"
        onPress={() => router.push('/signup')}
      >
        <Text className="text-white text-lg font-semibold">회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: '#1E3A5F' }}
        className="w-full h-12 rounded-md items-center justify-center"
        onPress={() => router.push('login')}
      >
        <Text className="text-white text-lg font-semibold">로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

Before_Login.options = {
  headerShown: false,
};

export default Before_Login;



