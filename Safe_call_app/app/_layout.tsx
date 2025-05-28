// app/_layout.tsx

import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { registerGlobals } from '@livekit/react-native';
import { UserProvider } from '@/context/UserContext';
import './globals.css';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/services/notificationService';

registerGlobals();

// Optional: Suppress known LiveKit warning
const originalConsoleError = console.error;

console.error = (...args: unknown[]) => {
  const firstArg = args[0];

  if (
    typeof firstArg === 'string' &&
    (
      firstArg.includes('unable to set answer') ||
      firstArg.includes("Tried to add a track for a participant")
    )
  ) {
    return; // ✅ Suppress known LiveKit harmless errors
  }

  originalConsoleError(...args); // Let all others through
};


export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // 🔔 Register push token
    registerForPushNotificationsAsync();

    // 🔁 Handle notification taps
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      // _layout.tsx
      if (data?.type === 'incoming_call') {
        router.push({
          pathname: '/IncomingCallScreen',
          params: {
            callId: data.callId, // ONLY this
          },
        });
      }
    });

    return () => subscription.remove();
  }, []);

  

  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
