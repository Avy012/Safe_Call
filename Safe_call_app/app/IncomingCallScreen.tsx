import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../context/UserContext';
import { getLiveKitToken } from '@/services/livekit';

interface Contact {
  id: string;
  name: string;
  phone: string;
  profilePic?: string;
}

export default function IncomingCallScreen() {
  const { callId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  console.log('👤 Logged-in user phone:', user?.phone); // ← add this

  const [contact, setContact] = useState<Contact | null>(null);
  const [callData, setCallData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 🔍 Load caller info
  useEffect(() => {
    const fetchContact = async () => {
      if (!callId || typeof callId !== 'string') {
        console.warn("❌ Invalid callId:", callId);
        setLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, 'users', callId));
        if (docSnap.exists()) {
          setContact({ id: docSnap.id, ...docSnap.data() } as Contact);
        } else {
          console.warn('❌ No such user in Firestore:', callId);
        }
      } catch (err) {
        console.error('🔥 Error loading user:', err);
      }
    };

    const fetchCall = async () => {
      if (!user?.uid) return;
      try {
        const callSnap = await getDoc(doc(db, 'calls', user.uid));
        if (callSnap.exists()) {
          setCallData(callSnap.data());
        }
      } catch (err) {
        console.error('🔥 Error loading call data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
    fetchCall();
  }, [callId, user?.uid]);

  const displayName = contact?.name || 'Unknown';
  const displayPhone = contact?.phone || '번호 없음';
  const profilePicUrl = !imageError && contact?.profilePic?.startsWith('http') ? { uri: contact.profilePic } : require('../assets/images/default_profile.jpg');

  if (!user || loading || !callData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4">🔄 데이터를 불러오는 중...</Text>
      </View>
    );
  }

  const handleReject = async () => {
    try {
      if (user?.uid) {
        await deleteDoc(doc(db, 'calls', user.uid));
        console.log("✅ Deleted call doc");
      }
    } catch (err) {
      console.error('❌ Failed to delete call doc:', err);
    }
    router.back();
  };

  const handleAccept = async () => {
    try {
      if (!user?.uid || !user.phone) {
        Alert.alert('❗ 오류', '사용자 정보를 불러오지 못했습니다.');
        return;
      }

      const myIdentity = user.phone;
      const myName = user.name ?? 'Unknown';
      const callerName = contact?.name ?? 'Unknown Caller';
      const callerProfile = contact?.profilePic ?? '';

      console.log('👤 Logged-in user phone (callee identity):', myIdentity);

      const newToken = await getLiveKitToken(myIdentity, myName, callData.roomName);
      if (!newToken) {
        Alert.alert('❌ 오류', '토큰을 받아오지 못했습니다.');
        return;
      }

      console.log('📲 Creating call with identity (callee):', myIdentity);

      await deleteDoc(doc(db, 'calls', user.uid));

      router.replace({
        pathname: '/generate_room',
        params: {
          token: encodeURIComponent(newToken),
          roomName: callData.roomName,
          name: callerName, // ✅ show caller’s name
          profilePic: encodeURIComponent(callerProfile),
          phone: callData.phone,
          userId: callData.callId, // ✅ this is caller’s UID
          callerId: callData.callId, // ✅ always callerId
        },
      });

    } catch (err) {
      console.error('❌ Failed to accept call:', err);
    }
  };



  return (
    <View className="flex-1 bg-black justify-between items-center pb-12 px-4">
      <View className="items-center mt-32">
        <Text className="text-gray-300 text-lg mb-4 pt-20">전화가 왔습니다</Text>
        <Image
          source={profilePicUrl}
          onError={() => {
            console.warn('❌ Failed to load image');
            setImageError(true);
          }}
          style={{
            width: 112,
            height: 112,
            borderRadius: 999,
            marginBottom: 16,
            backgroundColor: '#444',
          }}
        />
        <Text className="text-white text-3xl font-semibold">{displayName}</Text>
        <Text className="text-gray-400 text-lg mt-1">{displayPhone}</Text>
      </View>

      <View className="flex-row justify-around w-full pb-12 px-12 mt-16">
        <TouchableOpacity className="items-center" onPress={handleReject}>
          <Image source={require('../assets/icons/deny.png')} style={styles.icon} />
          <Text className="text-white text-sm pt-8">거절</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={handleAccept}>
          <Image source={require('../assets/icons/callButton.png')} style={styles.icon} />
          <Text className="text-white text-sm pt-8">받기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 65,
    height: 65,
    marginRight: 12,
  },
});
