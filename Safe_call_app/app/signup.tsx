import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { router } from 'expo-router';  // ✅ use router instead of navigation

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !phone) {
      Alert.alert('모든 정보를 입력해주세요.');
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        phone,
        created_at: new Date().toISOString(),
      });

      await sendEmailVerification(user);
      Alert.alert('이메일 인증 메일이 발송되었습니다. 메일함을 확인해주세요.');

      // ✅ navigate to login after successful signup
      router.replace('/login');

    } catch (err: any) {
      Alert.alert('회원가입 실패: ' + err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-2xl font-bold text-primary mb-6">Create Account</Text>

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
          className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-md"
        />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          className="w-full h-12 px-4 mb-6 border border-gray-300 rounded-md"
        />

        <TouchableOpacity
          onPress={handleSignup}
          className="w-full h-12 bg-primary rounded-md items-center justify-center"
        >
          <Text className="text-white text-lg font-semibold">SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
