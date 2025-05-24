// app/_layout.tsx

import React from 'react';
import { Slot } from 'expo-router';
import { registerGlobals } from '@livekit/react-native';
import { UserProvider } from '@/context/UserContext';
import './globals.css';
import { useFonts } from 'expo-font';

registerGlobals();

const originalConsoleError = console.error;

console.error = (...args: unknown[]) => {
  const firstArg = args[0];

  if (typeof firstArg === 'string' && firstArg.includes('unable to set answer')) {
    return; // suppress
  }

  originalConsoleError(...args); // keep other logs
};


export default function RootLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}

