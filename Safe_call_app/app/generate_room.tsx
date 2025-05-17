// 생성된 룸 입장하는 코드 
// 토큰 생성한거 가져오는 코드 추가해야 함 

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  ImageBackground,
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
import { useRouter,} from 'expo-router';
import { icons } from '@/constants/icons';

// Setup LiveKit WebRTC support
registerGlobals();

// Replace with your actual values   생성된 토큰 여기에 넣는걸로 하면 될 듯 
const wsURL = "wss://safecall-ozn2xsg6.livekit.cloud";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGtpbSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJpZGVudGl0eSIsImlzcyI6IkFQSXE2Q1Y1ZTM3N2hteiIsIm5iZiI6MTc0NzQ4NzE4NiwiZXhwIjoxNzQ3NTA4Nzg2fQ.6Bo0WiIbyehdGrDrLGrWaNO_WjxIY00-iRh1WwfT6Ms";

const LiveKitRoomScreen: React.FC = () => {
  // const roomRef = useRef<typeof LiveKitRoom | null>(null);  // Use ref to store room instance
  useEffect(() => {
    const start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
      console.log(token)
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
      // onConnected={() => {
      //   // Access the room instance after connection
      //   if (roomRef.current) {
      //     console.log("Connected to room:", roomRef.current);

      //     // Use track events to manage media
      //     roomRef.current.prototype.onTrackSubscribed = (track) =>  {
      //       console.log('Track Subscribed:', track);
      //     };

      //     roomRef.current.prototype.onTrackSubscribed = (track) => {
      //       console.log('Track Unsubscribed:', track);
      //     };
      //   }
      // }}
      // onError={(error) => {
      //   console.log('Error in connecting to the room:', error);
      // }}
    >
      <RoomView />
    </LiveKitRoom>
  );
};


const RoomView: React.FC = () => {
  const tracks = useTracks([Track.Source.Camera]);
  const router = useRouter();

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({ item }) => {
    if (isTrackReference(item)) {
      return <View style={styles.participantView} />; //여기서 영상 띄우면 영상으로 나가고 View로 띄우면 영상화면안나감 )
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
      {/* End Call Button */}
      <ImageBackground source={icons.hangup} className="w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden absolute left-1/2 -translate-x-1/2 bottom-40">
        <TouchableOpacity onPress={() => router.back()} className="w-full h-full"/>
      </ImageBackground>
    </View>
    
    
  );
};

export default LiveKitRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor : '#000000'
  },
  participantView: {
    height: 300,
    
  },
});
