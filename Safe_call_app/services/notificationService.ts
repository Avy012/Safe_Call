// services/notificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// ✅ Set notification display behavior once globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.setNotificationChannelAsync('incoming_calls', {
  name: 'Incoming Calls',
  importance: Notifications.AndroidImportance.MAX,
  sound: 'default',
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: 'safe-call-f0276',
  });

  const token = tokenData.data;
  console.log('📲 Got push token:', token);

  // ✅ Wait for current user with retry (up to 1.5s)
  let attempts = 0;
  while (!auth.currentUser && attempts < 6) {
    await new Promise((res) => setTimeout(res, 250));
    attempts++;
  }

  const user = auth.currentUser;
  if (user?.uid) {
    await setDoc(doc(db, 'users', user.uid), { pushToken: token }, { merge: true });
    console.log('✅ Push token saved to Firestore for UID:', user.uid);
  } else {
    console.warn('❌ Could not save push token — no logged-in user found.');
  }

  return token;
}

