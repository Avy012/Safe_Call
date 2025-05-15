import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { router } from 'expo-router';  // ✅ Use router

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      if (user.emailVerified) {
        Alert.alert('로그인 성공!');
        router.replace('/(tabs)'); 
      } else {
        Alert.alert('이메일 인증이 필요합니다. 메일함을 확인해주세요.');
      }
    } catch (err: any) {
      Alert.alert('로그인 실패: ' + err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Image source={require('../assets/images/logo.png')} className="w-24 h-24 mb-6" />
        <Text className="text-2xl font-bold text-primary mb-4">SAFE CALL</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-md"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full h-12 px-4 mb-6 border border-gray-300 rounded-md"
        />

        <TouchableOpacity
          onPress={handleLogin}
          className="w-full h-12 bg-primary rounded-md items-center justify-center"
        >
          <Text className="text-white text-lg font-semibold">LOGIN</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
