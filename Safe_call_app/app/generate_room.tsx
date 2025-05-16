// 생성된 룸 입장하는 코드 
// 토큰 생성한거 가져오는 코드 추가해야 함 

import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
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
import { Track } from 'livekit-client';

// Setup LiveKit WebRTC support
registerGlobals();

// Replace with your actual values   생성된 토큰 여기에 넣는걸로 하면 될 듯 
const wsURL = "wss://safecall-ozn2xsg6.livekit.cloud";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJpZGVudGl0eSIsImlzcyI6IkFQSXE2Q1Y1ZTM3N2hteiIsIm5iZiI6MTc0NzM2NTEyOCwiZXhwIjoxNzQ3Mzg2NzI4fQ.LDg9XW7bwCnnJ81swrQDofOUloUgs3opwNv-CCD3294";

const LiveKitRoomScreen: React.FC = () => {
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
      token={token}
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
