import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';  // useState, useEffect 추가
import Login from './screens/login';
import Signup from './screens/signup';
import Main from './screens/main';
import LoginAfter from './screens/loginAfter';
import { initializeFirebase } from './services/firebaseConfig';  // firebaseConfig에서 초기화 코드 가져오기

const Stack = createNativeStackNavigator();

export default function App() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);  // Firebase 초기화 상태 관리

  useEffect(() => {
    // Firebase 초기화 함수 호출
    const initializeApp = async () => {
      try {
        await initializeFirebase();  // Firebase 초기화
        setIsFirebaseReady(true);  // Firebase 초기화 완료 시 상태 업데이트
      } catch (error) {
        console.error("Firebase initialization failed", error);
      }
    };

    initializeApp();  // 초기화 함수 실행
  }, []);

  // Firebase가 준비되지 않으면 로딩 화면을 표시
   if (!isFirebaseReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LoginAfter" component={LoginAfter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
