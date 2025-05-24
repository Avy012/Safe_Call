import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  useLocalParticipant,
  registerGlobals,
} from '@livekit/react-native';
import { Track } from 'livekit-client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { icons } from '@/constants/icons'; // Adjust this path to your icons location


registerGlobals(); // Setup LiveKit for WebRTC

const wsURL = 'wss://safecall-ozn2xsg6.livekit.cloud';

const GenerateRoomScreen: React.FC = () => {
  const { token, name, profilePic } = useLocalSearchParams();
  const [roomToken, setRoomToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof token === 'string') {
      setRoomToken(token);
    }
  }, [token]);

  useEffect(() => {
    AudioSession.startAudioSession();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  if (!roomToken) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">📡 Connecting...</Text>
      </View>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={roomToken}
      connect={true}
      options={{ adaptiveStream: { pixelDensity: 'screen' } }}
      audio={true}
      video={true}
    >
      <RoomView name={name as string} profilePic={profilePic as string} />
    </LiveKitRoom>
  );
};

const RoomView: React.FC<{ name: string; profilePic: string }> = ({ name, profilePic }) => {
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
      {/* Remote video */}
      {remoteTrack && isTrackReference(remoteTrack) && isVideoOn && (
        <VideoTrack trackRef={remoteTrack} style={{ flex: 1 }} />
      )}

      {/* Local video */}
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

      {/* User name (optional) */}
      <View
        style={{ position: 'absolute', top: isVideoOn ? 100 : 150, left: 0, right: 0, alignItems: 'center',}}>
        {!isVideoOn && (
          <Image
            source={
              typeof profilePic === 'string' && profilePic.startsWith('http')
                ? { uri: profilePic }
                : require('@/assets/images/default_profile.jpg') // fallback image
            }
            onError={() => console.warn('❌ Failed to load profilePic:', profilePic)}
            style={{ width: 130, height: 130, borderRadius: 999, marginBottom: 12, backgroundColor: 'gray', }} />
        )}
        <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>{name}</Text>
      </View>



      {/* Toggle video */}
      <View className={isVideoOn ? "absolute bottom-10 left-10 items-center" : "absolute bottom-60 left-10 items-center"}>
        <ImageBackground
          source={isVideoOn ? icons.video_on : icons.video_off}
          className="w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden"
        >
          <TouchableOpacity onPress={toggleVideo} className="w-full h-full" />
        </ImageBackground>
      </View>

      {/* Mute/unmute */}
      <ImageBackground
        source={isMuted ? icons.mute_off : icons.mute_on}
        className={isVideoOn ? "w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden absolute right-10 bottom-10" : "w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden absolute right-10 bottom-60"}
      >
        <TouchableOpacity onPress={toggleMute} className="w-full h-full" />
      </ImageBackground>

      {/* Hang up */}
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

export default GenerateRoomScreen;
