
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../services/firebaseConfig';
import loginStyle from '../styles/login.style'; 

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      if (user.emailVerified) {
        Alert.alert('로그인 성공!');
        navigation.navigate('LoginAfter');
      } else {
        Alert.alert('이메일 인증이 필요합니다. 메일함을 확인해주세요.');
      }
    } catch (err: any) {
      Alert.alert('로그인 실패: ' + err.message);
    }
  };

  return (
    <View style={loginStyle.container}>
      <Image source={require('../assets/logo.png')} style={loginStyle.logo} />
      <Text style={loginStyle.title}>SAFE CALL</Text>
      <TextInput
        style={loginStyle.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={loginStyle.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={loginStyle.button} onPress={handleLogin}>
        <Text style={loginStyle.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
