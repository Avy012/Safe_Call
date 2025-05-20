// firebaseSetup.ts
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export async function registerFCMToken() {
  const user = auth().currentUser;
  if (!user) return;

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    console.log('✅ FCM Token:', fcmToken);

    await firestore().collection('users').doc(user.uid).set({
      fcmToken,
    }, { merge: true });
  }
}
