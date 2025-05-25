import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig'; // Update with your actual path
import { useAuth } from '../context/UserContext'; // Your auth context for current user

interface Contact {
  id: string;
  name: string;
  phone: string;
  profilePic?: string;
}

export default function IncomingCallScreen() {
  const { name, phone, token, roomName, callId } = useLocalSearchParams();
  console.log("📞 Incoming CallId:", callId);
  const router = useRouter();
  const { user } = useAuth();

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Load caller info (like profilePic) from Firestore
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
    } finally {
      setLoading(false);
    }
  };

  fetchContact();
}, [callId]);


  const displayName = name || contact?.name || 'Unknown';
  const displayPhone = phone || contact?.phone || '번호 없음';

  const profilePic =
    typeof contact?.profilePic === 'string' && contact.profilePic.startsWith('http')
      ? { uri: contact.profilePic }
      : require('../assets/images/default_profile.jpg'); // fallback image

  if (!user || loading) {
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
        console.log("🧹 Deleting doc: calls/" + user?.uid);
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
      if (user?.uid) {
        console.log("🧹 Deleting doc: calls/" + user?.uid);
        await deleteDoc(doc(db, 'calls', user.uid));
        console.log("✅ Deleted call doc");
      }
      router.push({
        pathname: '/generate_room',// 전화받으면
        params: {
          token: token as string,
          roomName: roomName as string,
          name: name as string,
          profilePic: profilePic as string,
        },
      });
    } catch (err) {
      console.error('❌ Failed to accept call:', err);
    }
  };

  return (
    <View className="flex-1 bg-black justify-between items-center pb-12 px-4">
      {/* 상단 텍스트 */}
      <View className="items-center">
        <Text className="text-gray-300 text-lg mb-4 pt-20">전화가 왔습니다</Text>

        {/* 프로필 이미지 */}
        <Image
          source={profilePic}
          style={{
            width: 112,
            height: 112,
            borderRadius: 999,
            marginBottom: 16,
            backgroundColor: '#444',
          }}
          onError={() => console.warn('❌ Failed to load image:', profilePic)}
        />

        <Text className="text-white text-3xl font-semibold">{displayName}</Text>
        <Text className="text-gray-400 text-lg mt-1">{displayPhone}</Text>
      </View>

      {/* 수락/거절 버튼 */}
      <View className="flex-row justify-around w-full pb-12 px-12 mt-16">
        {/* 거절 */}
        <TouchableOpacity className="items-center" onPress={handleReject}>
          <Image source={require('../assets/icons/deny.png')} style={styles.icon} />
          <Text className="text-white text-sm pt-8">거절</Text>
        </TouchableOpacity>

        {/* 수락 */}
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
