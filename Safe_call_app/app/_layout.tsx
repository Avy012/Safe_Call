// app/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';
import { registerGlobals } from '@livekit/react-native';
import { UserProvider } from '@/context/UserContext'; // 이 줄 추가
import './globals.css';


registerGlobals();


export default function RootLayout() {
  return (
    <UserProvider> {/*  전체 앱을 Context로 감싸*/}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="AddContact" options={{ headerShown: false }} />
        <Stack.Screen name="keypad" options={{ headerShown: false }} />
        <Stack.Screen name="callScreen" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen name="IncomingCallScreen" options={{ headerShown: false }} />
        <Stack.Screen name="calls/[callId]" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
