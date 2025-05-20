import { Stack } from 'expo-router';
import { registerGlobals } from '@livekit/react-native';
import './globals.css';


registerGlobals();


export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
