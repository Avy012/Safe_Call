import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  RoomProvider,
  useRoomContext,
  useParticipantConnected,
  useParticipantDisconnected,
} from '@livekit/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CallWrapper() {
  const { token, identity } = useLocalSearchParams();

  // 필수 파라미터 확인
  if (!token || !identity) {
    return (
      <View style={styles.centered}>
        <Text>Missing token or identity</Text>
      </View>
    );
  }

  return (
    <RoomProvider
      token={token as string}
      url="wss://your-livekit-server-url" // ← 여기를 실제 LiveKit 서버 주소로 바꾸세요!
      connectOptions={{ autoSubscribe: true }}
    >
      <CallScreen />
    </RoomProvider>
  );
}

function CallScreen() {
  const room = useRoomContext();
  const router = useRouter();

  useParticipantConnected((participant) => {
    console.log('참가자 연결됨:', participant.identity);
  });

  useParticipantDisconnected((participant) => {
    console.log('참가자 연결 종료:', participant.identity);
  });

  const leaveRoom = async () => {
    await room.disconnect();
    router.replace('/keypad'); // 통화 종료 후 키패드로 이동
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📞 통화 중...</Text>
      <Text style={styles.text}>Room: {room.name || '접속 중...'}</Text>

      <Button title="통화 종료" onPress={leaveRoom} color="#B22222" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
  },
});
