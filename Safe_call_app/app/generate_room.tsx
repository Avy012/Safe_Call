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
  Text,
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
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGtpbTEiLCJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6Im15LXJvb20iLCJjYW5QdWJsaXNoIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlfSwic3ViIjoiaWRlbnRpdHkxIiwiaXNzIjoiQVBJcTZDVjVlMzc3aG16IiwibmJmIjoxNzQ3NzQzNTgxLCJleHAiOjE3NDc3NjUxODF9.KbsWltf08yUA0usuRlLAyJvxRN5_JiCp2dqXf0v-jC4";

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

      
      <View className={isVideoOn ? "absolute top-10 left-0 right-0 items-center" : "absolute top-20 left-0 right-0 items-center"}>
        <Text className="text-white text-lg font-bold">사용자 이름</Text>
      </View>



      {/* 영상통화 버튼 */}
      <View className={isVideoOn ? "absolute bottom-10 left-10 items-center" : "absolute bottom-60 left-10 items-center"}>
        <ImageBackground
          source={isVideoOn ? icons.video_on : icons.video_off}
          className="w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden"
        >
          <TouchableOpacity onPress={toggleVideo} className="w-full h-full" />
        </ImageBackground>
      </View>

      {/* 음소거 버튼 */}
      <ImageBackground
        source={isMuted ? icons.mute_off : icons.mute_on}
        className={isVideoOn ? "w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden absolute right-10 bottom-10" : "w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden absolute right-10 bottom-60"}
      >
        <TouchableOpacity onPress={toggleMute} className="w-full h-full" />
      </ImageBackground>

      {/* 전화 끊기버튼 */}
      <View className={isVideoOn ? "absolute bottom-10 left-0 right-0 items-center" : "absolute bottom-60 left-0 right-0 items-center"}>
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
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
