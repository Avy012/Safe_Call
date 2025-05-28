// app/_layout.tsx

import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { registerGlobals } from '@livekit/react-native';
import { UserProvider } from '@/context/UserContext';
import './globals.css';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/services/notificationService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/services/firebaseConfig';
import axios from 'axios';

registerGlobals();

// Suppress known LiveKit warnings
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const firstArg = args[0];
  if (
    typeof firstArg === 'string' &&
    (firstArg.includes('unable to set answer') ||
      firstArg.includes('Tried to add a track for a participant'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

export default function RootLayout() {
  const router = useRouter();

  // ✅ Set notification display behavior once globally
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    // ✅ Setup Android notification channel (must come before any push received)
    Notifications.setNotificationChannelAsync('incoming_calls', {
      name: 'Incoming Calls',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    // ✅ Log registered channels
    Notifications.getNotificationChannelsAsync().then((channels) => {
      console.log('🔊 Registered Channels:', channels);
    });

    // ✅ Request permissions (cross-platform)
    Notifications.requestPermissionsAsync({
      ios: {
        allowSound: true,
        allowAlert: true,
        allowBadge: true,
      },
    });

    // ✅ Register for push notifications
    registerForPushNotificationsAsync();

    // ✅ Listen for notification tap
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === 'incoming_call') {
        router.push({
          pathname: '/IncomingCallScreen',
          params: {
            callId: data.callId,
          },
        });
      }
    });

    return () => subscription.remove();
  }, []);

  // ✅ Ping backend to avoid Render cold start
  useEffect(() => {
    axios.get('https://safe-call.onrender.com/ping').catch(() => {});
  }, []);

  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
