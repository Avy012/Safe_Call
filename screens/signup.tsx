import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import signupStyle from '../styles/signup.style'; 


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // 회원가입 처리
  const handleSignup = async () => {
    if (!email || !password || !phone) {
      Alert.alert('모든 정보를 입력해주세요.');
      return;
    }

    try {
      // 이미 존재하는 사용자 확인
      const existingUser = await signInWithEmailAndPassword(auth, email, password);
      const user = existingUser.user;

      if (user.emailVerified) {
        Alert.alert('인증이 완료되었습니다.');
        
      } else {
        Alert.alert('이메일 인증이 확인되지 않았습니다. 이메일을 확인해 주세요.');
      }
    } catch (err: any) {
      // 회원가입 및 이메일 인증 처리
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        phone,
        created_at: new Date().toISOString(),
      });

      await sendEmailVerification(user);  // 이메일 인증 메일 전송
      Alert.alert('이메일에서 인증확인 주소를 클릭해 주세요. 전송까지 시간이 걸릴 수 있습니다.');
    }
  };

  const handleEmailVerificationAlert = () => {
    Alert.alert(
      '이메일 인증 확인이 필요합니다',
      'SIGN UP 버튼을 클릭해주세요',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={signupStyle.container}>
      <Text style={signupStyle.header}>Create account</Text>
      <TextInput
        style={signupStyle.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={signupStyle.input}
        placeholder="PASSWORD"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={signupStyle.input}
        placeholder="PHONE NUMBER"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity
        style={signupStyle.verifyButton}
        onPress={handleEmailVerificationAlert}
      >
        <Text style={signupStyle.verifyText}>Email Verification</Text>
      </TouchableOpacity>

      <TouchableOpacity style={signupStyle.signupButton} onPress={handleSignup}>
        <Text style={signupStyle.signupText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;