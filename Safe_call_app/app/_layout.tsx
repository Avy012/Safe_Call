// app/_layout.tsx

import React from 'react';
import { Slot } from 'expo-router';
import { registerGlobals } from '@livekit/react-native';
import { UserProvider } from '@/context/UserContext';
import './globals.css';
import { useFonts } from 'expo-font';

registerGlobals();

export default function RootLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}

