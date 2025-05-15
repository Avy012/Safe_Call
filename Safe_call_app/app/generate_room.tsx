// 생성된 룸 입장하는 코드 
// 토큰 생성한거 가져오는 코드 추가해야 함 

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  Platform,
  Text
} from 'react-native';
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  registerGlobals,
} from '@livekit/react-native';
import { Track, Room, createLocalTracks, createLocalAudioTrack } from 'livekit-client';
import { handleAudioStream } from './livekitIntegration';

// Setup LiveKit WebRTC support
registerGlobals();

// Replace with your actual values   생성된 토큰 여기에 넣는걸로 하면 될 듯 
const wsURL = "wss://safecall-ozn2xsg6.livekit.cloud";

// 백엔드에서 토큰 받아오기 
export const fetchToken = async (room: string, identity: string): Promise<string> => {
  // 추후 서버 url로 변경해야 함 (우선 안드로이드 에뮬레이터 주소 사용)
  const res = await fetch('http://10.0.2.2:5000/getToken?room=${encodeURIComponent(room)$identity=%{encodeURIComponent(identity)}');
  if (!res.ok) {
    throw new Error('fetch token failed');
  }
  const data = await res.json();
  return data.token;
}

// 룸 연결 → 트랙 구독
export const connectToRoom = async (url: string, token: string) => {
  try {
    const tracks = await createLocalTracks({
        audio: true,
        video: false, // 비디오 기능 쓸 거면 추후 true로 변경하면 될 듯 
    });

    const room = new Room();
    await room.connect(url, token);

    tracks.forEach((track) => room.localParticipant.publishTrack(track));

    room.on('trackSubscribed', (track: Track) => {
      if (track.kind === 'audio' && track.mediaStream) {
        handleAudioStream(track.mediaStream);
      }
      else {
        console.error('undefined mediaStream');
      }
    });
  } catch (error) {
    console.error('room connect failed');
  }
};

const LiveKitRoomScreen: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  // 서버에서 토큰 가져오기
  useEffect(() => {
    const getToken = async() => {
      try {
        // 룸 네임이랑, 아이덴티티 추후 사용자 이름으로 받아와야 함 
        const fetchedToken = await fetchToken('myRoom', 'tester');
        setToken(fetchedToken); // 토큰 상태 저장
        console.log('token : ', fetchToken);
      } catch (error) {
        console.log('token fetch error', error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    const start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={token || undefined}
      connect={true}
      options={{
        adaptiveStream: { pixelDensity: 'screen' },
      }}
      audio={true}
      video={true}
    >
      <RoomView />
    </LiveKitRoom>
  );
};

const RoomView: React.FC = () => {
  const tracks = useTracks([Track.Source.Camera]);

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({ item }) => {
    if (isTrackReference(item)) {
      return <VideoTrack trackRef={item} style={styles.participantView} />;
    } else {
      return <View style={styles.participantView} />;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList<TrackReferenceOrPlaceholder>
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default LiveKitRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  participantView: {
    height: 300,
  },
});
