// 생성된 룸 입장하는 코드 
// 토큰 생성한거 가져오는 코드 추가해야 함 

import React, { useEffect, useState } from 'react';
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
  useLocalParticipant,
} from '@livekit/react-native';
import { Track } from 'livekit-client';
import { useRouter,} from 'expo-router';
import { icons } from '@/constants/icons';

// Setup LiveKit WebRTC support
registerGlobals();

// Replace with your actual values   생성된 토큰 여기에 넣는걸로 하면 될 듯 
const wsURL = "wss://safecall-ozn2xsg6.livekit.cloud";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGtpbSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJpZGVudGl0eSIsImlzcyI6IkFQSXE2Q1Y1ZTM3N2hteiIsIm5iZiI6MTc0NzcxMDU4NSwiZXhwIjoxNzQ3NzMyMTg1fQ.9FjRVKI7v-sDRPJsAcN3eC95dtZbZfr8w2PW9-k2FFE";

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
    >
      <RoomView />
    </LiveKitRoom>
  );
};




const RoomView: React.FC = () => {
  const router = useRouter();
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Camera]);

  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const toggleMute = async () => {
    await localParticipant.setMicrophoneEnabled(!isMuted);
    setIsMuted(!isMuted);
  };

  const toggleVideo = async () => {
    await localParticipant.setCameraEnabled(!isVideoOn);
    setIsVideoOn(!isVideoOn);
  };

  const localTrack = tracks.find(
    (t) => isTrackReference(t) && t.participant.identity === localParticipant.identity
  );

  const remoteTrack = tracks.find(
    (t) =>
      isTrackReference(t) &&
      t.participant.identity !== localParticipant.identity &&
      t.source === Track.Source.Camera
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Remote video (full screen) */}
      {remoteTrack && isTrackReference(remoteTrack) && isVideoOn && (
        <VideoTrack trackRef={remoteTrack} style={{ flex: 1 }} />
      )}

      {/* Local video (small floating window) */}
      {localTrack && isTrackReference(localTrack) && isVideoOn && (
        <View
          style={{
            position: 'absolute',
            top: 40,
            right: 20,
            width: 120,
            height: 160,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <VideoTrack trackRef={localTrack} style={{ flex: 1 }} />
        </View>
      )}

      {/* Toggle Video Button */}
      <View className="absolute bottom-80 left-0 right-0 items-center">
        <ImageBackground
          source={isVideoOn ? icons.video_on : icons.video_off}
          className="w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden"
        >
          <TouchableOpacity onPress={toggleVideo} className="w-full h-full" />
        </ImageBackground>
      </View>

      {/* Mute Button */}
      <ImageBackground
        source={isMuted ? icons.mute_off : icons.mute_on}
        className="w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden absolute right-10 bottom-80"
      >
        <TouchableOpacity onPress={toggleMute} className="w-full h-full" />
      </ImageBackground>

      {/* Hangup Button */}
      <View className="absolute bottom-40 left-0 right-0 items-center">
        <ImageBackground
          source={icons.hangup}
          className="w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden"
        >
          <TouchableOpacity onPress={() => router.back()} className="w-full h-full" />
        </ImageBackground>
      </View>
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
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
