import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  VideoTrack,
  isTrackReference,
  useLocalParticipant,
  useRoomContext,
  registerGlobals,
} from '@livekit/react-native';
import { Track, RoomEvent } from 'livekit-client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { icons } from '@/constants/icons';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { getLiveKitToken } from '@/services/livekit';

registerGlobals();
const wsURL = 'wss://safecall-ozn2xsg6.livekit.cloud';

const GenerateRoomScreen: React.FC = () => {
  const { roomName, name, profilePic: rawPic } = useLocalSearchParams();

  const profilePic =
    typeof rawPic === 'string' ? decodeURIComponent(rawPic) : '';

  const [roomToken, setRoomToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      await Audio.requestPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const userIdentity = name || 'anonymous';
        const token = await getLiveKitToken(userIdentity as string, roomName as string);
        console.log('✅ LiveKit token received:', token);
        setRoomToken(token);
      } catch (err) {
        console.error('❌ Failed to get LiveKit token:', err);
      }
    };
    fetchToken();
  }, [name, roomName]);

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
  console.log('🖼️ Raw profilePic beforesend:', profilePic);

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={roomToken}
      connect={true}
      audio={true}
      video={false}
      options={{ adaptiveStream: true }}
    >
      <RoomView name={name as string} profilePic={profilePic as string} />
    </LiveKitRoom>
  );
};

const RoomView: React.FC<{ name: string; profilePic: string }> = ({ name }) => {
  const router = useRouter();
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Camera]);
  const room = useRoomContext();

  const [isMuted, setIsMuted] = useState(true); // initial guess
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [hasConnected, setHasConnected] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const onConnected = () => {
      console.log('✅ RoomEvent.Connected');
      setIsConnected(true);
      setHasConnected(true);

      // 🔄 Sync actual mic/camera state
      setIsMuted(!localParticipant.isMicrophoneEnabled);
      setIsVideoOn(localParticipant.isCameraEnabled);

      timer = setTimeout(() => {
        console.log('⏱️ canPublish now true');
        setCanPublish(true);
      }, 1000);
    };

    const onDisconnected = () => {
      console.warn('🚫 RoomEvent.Disconnected');
      setIsConnected(false);
      setCanPublish(false);
      if (timer) clearTimeout(timer);
    };

    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.Disconnected, onDisconnected);

    return () => {
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Disconnected, onDisconnected);
      if (timer) clearTimeout(timer);
    };
  }, [room, localParticipant]);

  const toggleMute = async () => {
    if (!(hasConnected || isConnected) || !canPublish) {
      console.warn('⚠️ Not ready — mic toggle blocked');
      return;
    }

    try {
      await localParticipant.setMicrophoneEnabled(isMuted); // ← use previous isMuted
      setIsMuted((prev) => !prev);
    } catch (err) {
      console.error('❌ Error toggling mic:', err);
    }
  };

  const toggleVideo = async () => {
    if (!(hasConnected || isConnected) || !canPublish) {
      console.warn('⚠️ Not ready — video toggle blocked');
      return;
    }

    try {
      await localParticipant.setCameraEnabled(!isVideoOn);
      setIsVideoOn((prev) => !prev);
    } catch (err) {
      console.error('❌ Error toggling camera:', err);
    }
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
      {remoteTrack && isTrackReference(remoteTrack) && isVideoOn ? (
        <VideoTrack trackRef={remoteTrack} style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 150 }}>
          <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>{name}</Text>
        </View>
      )}

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
      
      {/* VIDEO BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: isVideoOn ? 40 : 150,
          left: 40,
        }}
      >
        <TouchableOpacity onPress={toggleVideo}>
          <ImageBackground
            source={isVideoOn ? icons.video_on : icons.video_off}
            style={{ width: 70, height: 70 }}
          />
          {/* 핸드폰 비율 봐서 이 부분 수정해야 될 수 있음 left-7 이부분  */}
          <Text className="text-white text-sm pt-8 left-5">영상통화</Text> 
        </TouchableOpacity> 

      </View>

      {/* MUTE BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: isVideoOn ? 40 : 150,
          right: 40,
        }}
      >
        <TouchableOpacity onPress={toggleMute}>
          <ImageBackground
            source={isMuted ? icons.mute_on : icons.mute_off}
            style={{ width: 70, height: 70 }}
          />
          <Text className="text-white text-sm pt-8 left-6">음소거</Text>
        </TouchableOpacity>
      </View>

      {/* HANG UP */}
      <View
        style={{
          position: 'absolute',
          bottom: isVideoOn ? 40 : 150,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ImageBackground
            source={icons.hangup}
            style={{ width: 70, height: 70 }}
          />
          <Text className="text-white text-sm pt-8 left-5">통화종료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default GenerateRoomScreen;
