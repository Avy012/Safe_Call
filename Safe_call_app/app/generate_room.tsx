import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
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
import { saveCallLog } from '@/services/callLogStorage';
import { auth } from '@/services/firebaseConfig';

registerGlobals();
const wsURL = 'wss://safecall-ozn2xsg6.livekit.cloud';

const GenerateRoomScreen: React.FC = () => {
  const {
    roomName,
    name,
    profilePic: rawProfilePic,
    userId: contactId,
    phone,
    callerId,
  } = useLocalSearchParams();

  const [roomToken, setRoomToken] = useState<string | null>(null);
  const profilePic = typeof rawProfilePic === 'string' ? rawProfilePic : '';
  const router = useRouter();

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

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={roomToken}
      connect={true}
      audio={true}
      video={false}
      options={{ adaptiveStream: true }}
    >
      <RoomView
        name={name as string}
        profilePic={profilePic}
        contactId={contactId as string}
        phone={phone as string}
        callerId={callerId as string}
      />
    </LiveKitRoom>
  );
};

const RoomView: React.FC<{
  name: string;
  profilePic: string;
  contactId: string;
  phone: string;
  callerId: string;
}> = ({ name, profilePic, contactId, phone, callerId }) => {
  const router = useRouter();
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Camera]);
  const room = useRoomContext();

  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [hasConnected, setHasConnected] = useState(false);

  const roomStartTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const onConnected = () => {
      console.log('✅ RoomEvent.Connected');
      setIsConnected(true);
      setHasConnected(true);

      roomStartTimeRef.current = new Date();

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
      room.disconnect().catch((err) => console.warn('Room disconnect on unmount failed:', err));
    };
  }, [room, localParticipant]);

  const toggleMute = async () => {
    if (!(hasConnected || isConnected) || !canPublish) {
      console.warn('⚠️ Not ready — mic toggle blocked');
      return;
    }

    try {
      await localParticipant.setMicrophoneEnabled(isMuted);
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

  const handleHangUp = async () => {
    const endTime = new Date();
    try {
      await room.disconnect();
      console.log('📴 Disconnected from room');

      const startTime = roomStartTimeRef.current;
      if (!startTime) {
        console.warn('⚠️ No start time found, skipping log save');
        return;
      }

      const durationSec = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      const currentUserId = auth.currentUser?.uid;
      const isCaller = currentUserId === callerId;

      const otherUserInfo = isCaller
        ? { userId: contactId, name, phone, profile: profilePic }
        : { userId: callerId, name: '상대방', phone: '알 수 없음', profile: '' }; // fallback for receiver

      await saveCallLog({
        userId: otherUserInfo.userId,
        name: otherUserInfo.name,
        phone: otherUserInfo.phone,
        profile: otherUserInfo.profile,
        summary: '',
        type: isCaller ? '발신' : '수신',
        startTime: startTime.toISOString(),
        duration: durationSec,
      });

      console.log('✅ Call log saved');
    } catch (err) {
      console.error('❌ Failed to disconnect or save call log:', err);
    }

    router.replace('/');
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

      <View style={{ position: 'absolute', bottom: isVideoOn ? 40 : 150, left: 40 }}>
        <TouchableOpacity onPress={toggleVideo}>
          <ImageBackground source={isVideoOn ? icons.video_on : icons.video_off} style={{ width: 70, height: 70 }} />
          <Text className="text-white text-sm pt-8 left-5">영상통화</Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', bottom: isVideoOn ? 40 : 150, right: 40 }}>
        <TouchableOpacity onPress={toggleMute}>
          <ImageBackground source={isMuted ? icons.mute_on : icons.mute_off} style={{ width: 70, height: 70 }} />
          <Text className="text-white text-sm pt-8 left-6">음소거</Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', bottom: isVideoOn ? 40 : 150, left: 0, right: 0, alignItems: 'center' }}>
        <TouchableOpacity onPress={handleHangUp}>
          <ImageBackground source={icons.hangup} style={{ width: 70, height: 70 }} />
          <Text className="text-white text-sm pt-8 left-5">통화종료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GenerateRoomScreen;
