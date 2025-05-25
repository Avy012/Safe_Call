import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../context/UserContext';

interface Contact {
  id: string;
  name: string;
  phone: string;
  profilePic?: string;
}

export default function IncomingCallScreen() {
  const { name, phone, token, roomName, callId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [contact, setContact] = useState<Contact | null>(null);
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
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [callId]);

  const displayName = name || contact?.name || 'Unknown';
  const displayPhone = phone || contact?.phone || '번호 없음';
  const profilePicUrl = !imageError && contact?.profilePic?.startsWith('http') ? { uri: contact.profilePic } : require('../assets/images/default_profile.jpg');

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
        await deleteDoc(doc(db, 'calls', user.uid));
        console.log("✅ Deleted call doc");
      }

      console.log('🧼 Final profilePic string:', contact?.profilePic);

      router.replace({
        pathname: '/generate_room',
        params: {
          token: token as string,
          roomName: roomName as string,
          name: displayName,
          profilePic: encodeURIComponent(contact?.profilePic ?? ''),
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
