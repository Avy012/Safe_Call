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
  TrackReferenceOrPlaceholder,
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
import { getLiveKitToken } from '@/services/livekit'; // ✅ You must implement this if not present

registerGlobals();
const wsURL = 'wss://safecall-ozn2xsg6.livekit.cloud';

const GenerateRoomScreen: React.FC = () => {
  const { roomName, name, profilePic } = useLocalSearchParams();
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

const RoomView: React.FC<{ name: string; profilePic: string }> = ({ name, profilePic }) => {
  const router = useRouter();
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Camera]);
  const room = useRoomContext();

  const [isMuted, setIsMuted] = useState(true);
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
  }, [room]);

  useEffect(() => {
    const trackInfo = tracks.map((t) =>
      isTrackReference(t)
        ? `${t.source} | ID: ${t.track?.sid ?? 'no track'}`
        : 'placeholder'
    );
    console.log('🎥 Current tracks:', trackInfo);
  }, [tracks]);

  useEffect(() => {
    const updateMediaStates = () => {
      setIsMuted(!localParticipant.isMicrophoneEnabled);
      setIsVideoOn(localParticipant.isCameraEnabled);
    };

    updateMediaStates();
    room.on(RoomEvent.LocalTrackPublished, updateMediaStates);
    room.on(RoomEvent.LocalTrackUnpublished, updateMediaStates);

    return () => {
      room.off(RoomEvent.LocalTrackPublished, updateMediaStates);
      room.off(RoomEvent.LocalTrackUnpublished, updateMediaStates);
    };
  }, [room, localParticipant]);

  const toggleMute = async () => {
    if (!(hasConnected || isConnected) || !canPublish) {
      console.warn('⚠️ Not ready — mic toggle blocked');
      return;
    }

    try {
      await localParticipant.setMicrophoneEnabled(!isMuted);
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

  const safeImageSource =
    typeof profilePic === 'string' && profilePic.startsWith('http')
      ? { uri: profilePic }
      : require('@/assets/images/default_profile.jpg');

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {remoteTrack && isTrackReference(remoteTrack) && isVideoOn ? (
        <VideoTrack trackRef={remoteTrack} style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={safeImageSource}
            onError={() => console.warn('❌ Failed to load profilePic:', profilePic)}
            style={{
              width: 130,
              height: 130,
              borderRadius: 999,
              marginBottom: 12,
              backgroundColor: 'gray',
            }}
          />
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

      <View
        className={
          isVideoOn
            ? 'absolute bottom-10 left-10 items-center'
            : 'absolute bottom-60 left-10 items-center'
        }
      >
        <ImageBackground
          source={isVideoOn ? icons.video_on : icons.video_off}
          className="w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden"
        >
          <TouchableOpacity onPress={toggleVideo} className="w-full h-full" />
        </ImageBackground>
      </View>

      <ImageBackground
        source={isMuted ? icons.mute_off : icons.mute_on}
        className={
          isVideoOn
            ? 'w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden absolute right-10 bottom-10'
            : 'w-[70px] h-[70px] mx-2 rounded-xl overflow-hidden absolute right-10 bottom-60'
        }
      >
        <TouchableOpacity onPress={toggleMute} className="w-full h-full" />
      </ImageBackground>

      <View
        className={
          isVideoOn
            ? 'absolute bottom-10 left-0 right-0 items-center'
            : 'absolute bottom-60 left-0 right-0 items-center'
        }
      >
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
