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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { router } from 'expo-router'; // if not already imported
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Asset } from 'expo-asset';;




registerGlobals();
const wsURL = 'wss://safecall-ozn2xsg6.livekit.cloud';

const GenerateRoomScreen: React.FC = () => {
  const {
  token: rawToken,
  name,
  roomName,
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
    if (typeof rawToken === 'string') {
      const decoded = decodeURIComponent(rawToken);
      console.log('✅ Using passed token:', decoded);
      setRoomToken(decoded); // ✅ Only use this token!
    } else {
      console.error('❌ No token passed in route params');
    }
  }, [rawToken]);


  useEffect(() => {
    const setupAudio = async () => {
      try {
        // 🎧 Route audio to speaker, enable recording, etc.
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false, // false = speaker
        });

        // 🎙️ Start LiveKit audio session
        await AudioSession.startAudioSession();
        console.log('✅ Audio session started');
      } catch (error) {
        console.error('❌ Audio session setup failed:', error);
      }
    };

    setupAudio();

    return () => {
      AudioSession.stopAudioSession().catch((error) =>
        console.error('❌ Failed to stop audio session:', error)
      );
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
  const [showScamWarning, setShowScamWarning] = useState(false);
  const currentUserId = auth.currentUser?.uid;

  console.log('🔍 typeof currentUserId:', typeof currentUserId, currentUserId);
  console.log('🔍 typeof callerId:', typeof callerId, callerId);

  const isCaller = currentUserId === callerId;
  const isCallee = !isCaller;



  const roomStartTimeRef = useRef<Date | null>(null);

  

  useEffect(() => {
  let timer: ReturnType<typeof setTimeout>;
  let scamCheckTimer: ReturnType<typeof setTimeout>;

  const onConnected = () => {
    console.log('✅ RoomEvent.Connected');
    setIsConnected(true);
    setHasConnected(true);

    roomStartTimeRef.current = new Date();

    setIsMuted(!localParticipant.isMicrophoneEnabled);
    setIsVideoOn(localParticipant.isCameraEnabled);

    timer = setTimeout(() => {
      setCanPublish(true);
    }, 1000);

    // ✅ ✅ ✅ RUN THIS HERE AFTER ROOM IS READY
    const uid = auth.currentUser?.uid;
    console.log('🧾 currentUserId:', uid, 'contactId:', contactId);
    if (isCaller || isCallee) {
      scamCheckTimer = setTimeout(() => {
        console.log('⏳ Triggering scam check...');
        fetchCallScamCheck(isCallee); // ✅ pass isCallee
      }, 3000);
    }

  };

  const onDisconnected = () => {
    console.warn('🚫 RoomEvent.Disconnected');
    setIsConnected(false);
    setCanPublish(false);
    if (timer) clearTimeout(timer);
    if (scamCheckTimer) clearTimeout(scamCheckTimer);
  };

  room.on(RoomEvent.Connected, onConnected);
  room.on(RoomEvent.Disconnected, onDisconnected);

  return () => {
    room.off(RoomEvent.Connected, onConnected);
    room.off(RoomEvent.Disconnected, onDisconnected);
    if (timer) clearTimeout(timer);
    if (scamCheckTimer) clearTimeout(scamCheckTimer);
    room.disconnect().catch((err) =>
      console.warn('Room disconnect on unmount failed:', err)
    );
  };
}, [room, localParticipant, contactId]);




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
      if (!currentUserId || !callerId || !contactId) {
        console.error('🚨 Missing IDs:', { currentUserId, callerId, contactId });
        return;
      }

      const isCaller = currentUserId === callerId;
      const otherUserId = isCaller ? contactId : callerId;

      // 🔥 Fetch both users from Firestore
      const [meSnap, otherSnap] = await Promise.all([
        getDoc(doc(db, 'users', currentUserId)),
        getDoc(doc(db, 'users', otherUserId)),
      ]);

      const meData = meSnap.data();
      const otherData = otherSnap.data();

      const myInfo = {
        id: currentUserId,
        name: meData?.name || '나',
        phone: meData?.phone || '알 수 없음',
        profile: meData?.profilePic || '',
      };

      const otherInfo = {
        id: otherUserId,
        name: otherData?.name || '상대방',
        phone: otherData?.phone || '알 수 없음',
        profile: otherData?.profilePic || '',
      };

      console.log('🧾 isCaller:', isCaller);
      console.log('📲 currentUserId:', currentUserId);
      console.log('📞 callerId:', callerId);
      console.log('📞 contactId:', contactId);

      console.log('🧍 My Info:', myInfo);
      console.log('👤 Other Info:', otherInfo);


      await saveCallLog({
        callerId,
        calleeId: contactId,
        callerName: isCaller ? myInfo.name : otherInfo.name,
        callerPhone: isCaller ? myInfo.phone : otherInfo.phone,
        callerProfile: isCaller ? myInfo.profile : otherInfo.profile,

        calleeName: isCaller ? otherInfo.name : myInfo.name,
        calleePhone: isCaller ? otherInfo.phone : myInfo.phone,
        calleeProfile: isCaller ? otherInfo.profile : myInfo.profile,

        isCaller,
        duration: durationSec,
        startTime: startTime.toISOString(),
        type: isCaller ? '발신' : '수신',
        summary: summaryRef.current || '',
        
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

  const summaryRef = useRef<string>('');
  const isScamRef = useRef<boolean>(false);

  useEffect(() => {
    let sound: Audio.Sound | null = null;

    const playWarningSound = async () => {
      try {
        const asset = Asset.fromModule(require('../assets/alarm.wav'));
        await asset.downloadAsync(); // Ensure asset is loaded

        sound = new Audio.Sound();
        await sound.loadAsync({ uri: asset.localUri! });
        await sound.playAsync();
      } catch (error) {
        console.error('🔊 Failed to play scam warning sound:', error);
      }
    };

    if (showScamWarning && isCallee) {
      playWarningSound();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [showScamWarning, isCallee]);



 const fetchCallScamCheck = async (isCallee: boolean) => {
    console.log('📞 fetchCallScamCheck triggered');

    try {
      const asset = Asset.fromModule(require('../assets/scenario4.wav'));
      await asset.downloadAsync();
      const dest = FileSystem.documentDirectory + 'scenario4.wav';
      await FileSystem.copyAsync({ from: asset.localUri!, to: dest });
      console.log('✅ File copied to:', dest);

      const fileInfo = await FileSystem.getInfoAsync(dest);
      if (!fileInfo.exists) {
        console.error('❌ Copied file does not exist');
        return;
      }
      console.log('📦 File size (bytes):', fileInfo.size);

      const fileBase64 = await FileSystem.readAsStringAsync(dest, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('📏 base64 length:', fileBase64.length);

      // 2. STT
      const sttResponse = await axios.post(
        'https://usyvahybz2.execute-api.us-east-1.amazonaws.com/dev/audio',
        { audio: fileBase64 }
      );
      const text = sttResponse.data.body || '';
      if (!text) {
        console.warn('⚠️ No STT result received');
        return;
      }

      // 3. Scam check (only callee)
      if (isCallee) {
        const scamResponse = await axios.post(
          'https://usyvahybz2.execute-api.us-east-1.amazonaws.com/dev/check',
          { text }
        );
        const scamResult = scamResponse.data?.result?.trim() === '예';
        isScamRef.current = scamResult;
        if (scamResult) {
          console.log('⛔ Scam detected');
          setShowScamWarning(true);
        }
      }

      // 4. Summary (everyone)
      const summaryResponse = await axios.post(
        'https://usyvahybz2.execute-api.us-east-1.amazonaws.com/dev/SummationText',
        { text }
      );

      let summaryText = '요약 없음';
      try {
        const parsed = JSON.parse(summaryResponse.data.body);
        summaryText = parsed.result?.trim() || '요약 없음';
      } catch (e) {
        console.warn('⚠️ Failed to parse summary Lambda body:', e);
        summaryText = summaryResponse.data.body || '요약 없음';
      }

      console.log('📝 summaryText:', summaryText);
      summaryRef.current = summaryText;
    } catch (err) {
      console.error('❌ fetchCallScamCheck error:', err);
    }
  };





  

  

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {remoteTrack && isTrackReference(remoteTrack) && isVideoOn ? (
        <VideoTrack trackRef={remoteTrack} style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 150 }}>
          <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>{name}</Text>
        </View>
      )}

      {showScamWarning && isCallee &&  (
        <View
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            right: 20,
            padding: 10,
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            borderRadius: 10,
            zIndex: 1000,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
            🚨 이 전화는 스캠일 수 있습니다.
          </Text>
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

      <View style={{ position: 'absolute', bottom: isVideoOn ? 120 : 230, left: 0, right: 0, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setShowScamWarning(true)}>
          <ImageBackground source={icons.warning} style={{ width: 70, height: 70 }} />
          <Text className="text-white text-sm pt-8 left-4">스캠경고</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default GenerateRoomScreen;
