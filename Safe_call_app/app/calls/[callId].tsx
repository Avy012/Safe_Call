import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { getLiveKitToken } from '@/services/livekit';
import { connectToRoom } from '@/services/livekitConnect';
import { auth } from '../../services/firebaseConfig';



interface Contact {
  id: string;
  name: string;
  phone: string;
  profilePic: string;
}

export default function CallDetail() {
  const { callId } = useLocalSearchParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatPhoneNumber = (num: string) => {
    if (!num || num.length !== 11) return num; // return as-is if invalid
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  };


  // Debug
  console.log('📞 Route param CallId  callee userid:', callId);

  useEffect(() => {
    const fetchContact = async () => {
      if (!callId || typeof callId !== 'string') {
        console.warn('🚫 Invalid CallId:', callId);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', callId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as Contact;
            setContact({ ...data, id: callId }); 
        } else {
          console.warn('❌ Contact not found in Firestore for ID:', callId);
        }

      } catch (err) {
        console.error('🔥 Firestore error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [callId]);

  // Timeout failsafe
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⏱ Timeout: forcibly ending loading');
        setLoading(false);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [loading]);

  const handleCall = async () => {
  console.log('📞 handleCall triggered');
  if (!contact?.id) {
    Alert.alert('Error', '잘못된 연락처입니다.');
    return;
  }

  const callerId = auth.currentUser?.uid;
  const receiverId = contact.id;

  if (!callerId) {
    Alert.alert('Error', '로그인 정보가 없습니다.');
    return;
  }

  try {
    // 1. Get token for caller only
    const userDoc = await getDoc(doc(db, 'users', callerId));
    if (!userDoc.exists()) throw new Error('Caller Firestore user not found.');
    const userData = userDoc.data();
    const callerPhone = userData.phone; // this MUST be the current user’s phone
    const token = await getLiveKitToken(callerPhone, receiverId, userData.name);
     // ✅ Use caller’s phone only
     
    console.log('callerPhone:', callerPhone, 'receiverId:', receiverId, 'userData.name:', userData.name);
    if (!token) {
      console.error('❌ No token returned from backend');
      Alert.alert('연결 실패', '서버로부터 토큰을 가져오지 못했습니다.');
      return;
    }


    // 2. Write to Firestore for callee to join later
    await setDoc(doc(db, 'calls', receiverId), {
      name: userData.name ?? '이름 없음',
      phone: userData.phone ?? '알 수 없음',
      profilePic: (userData.profilePic ?? '').replace(/prrofilePics|profilePiccs/g, 'profilePics'),
      callId: callerId,
      token,
      roomName: 'safe-call-room',
    });
    console.log('📲 Creating call with identity (caller):', callerPhone);


    // 3. Go to call screen as caller
    router.push({
      pathname: '/generate_room',
      params: {
        token: encodeURIComponent(token),
        name: contact.name,
        profilePic: encodeURIComponent((userData.profilePic ?? '').replace(/prrofilePics|profilePiccs/g, 'profilePics')),
        phone: contact.phone,
        userId: contact.id,
        callerId, // ✅ Pass explicitly
      },
    });

  } catch (error) {
    console.error('📞 Call failed:', error);
    Alert.alert('통화 오류', '전화 연결에 실패했습니다.');
  }
};

  const handleBlock = async () => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId || !contact?.id) return;

      await setDoc(
        doc(db, `users/${currentUserId}/blockedUsers/${contact.id}`),
        { name: contact.name, phone: contact.phone, blockedAt: new Date() }
      );

      setBlocked(true);
      Alert.alert('차단 완료', `${contact?.name ?? '연락처'}님이 차단되었습니다.`);
    } catch (error) {
      console.error('❌ 차단 실패:', error);
      Alert.alert('오류', '차단에 실패했습니다.');
    }
  };

  const handleDelete = () => {
    Alert.alert('삭제 완료', '연락처가 삭제되었습니다.');
  };

  const profileImageSource =
  typeof contact?.profilePic === 'string' && contact.profilePic.startsWith('http')
    ? { uri: contact.profilePic }
    : require('../../assets/images/default_profile.jpg');




  const callHistory: { date: string; type: string; duration: string }[] = [
    { date: '2025-05-18', type: '수신', duration: '3분' },
    { date: '2025-05-15', type: '발신', duration: '6분' },
    { date: '2025-05-10', type: '부재중', duration: '-' },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text className="mt-4 text-gray-600">불러오는 중... ID: {String(callId)}</Text>
      </View>
    );
  }

  if (!contact) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg font-semibold">
          ❗ 연락처를 불러올 수 없습니다.
        </Text>
        <Text className="text-gray-500 mt-2">ID: {String(callId)}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-600 underline">← 돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-12 pb-6 justify-between">
      <View className="flex-row items-center justify-between ">
        <TouchableOpacity
          onPress={() => router.replace('/contacts')}
          className="absolute bg-white rounded-lg z-10"
          style={{ top: 4, left: 0 }} // ⬅ move up and left
        >
          <Text className="text-4xl text-primary-1000">←</Text>
        </TouchableOpacity>

        <View className="items-end mt-0">
          <TouchableOpacity
            className="absolute top-0 right-2 p-2 mt-4 bg-white rounded-lg z-10"
            onPress={handleDelete}
          >
            <Text className="text-black font-semibold text-lg">❌</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center pt-0 mb-4">
        <Image source={profileImageSource} className="w-28 h-28 rounded-full mb-5" />
        <Text className="text-3xl font-semibold">{contact.name}</Text>
        {contact.phone && (
          <Text className="text-lg font-medium text-blue-700 mt-3">
            {formatPhoneNumber(contact.phone)}
          </Text>
        )}
      </View>


      <View className="w-full px-2">
        <Text className="text-lg font-bold mb-6 text-center">최근 통화 목록</Text>
        <FlatList
          data={callHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="flex-row justify-between px-4 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-800">{item.date}</Text>
              <Text className="text-base text-gray-800">{item.type}</Text>
              <Text className="text-base text-gray-800">{item.duration}</Text>
            </View>
          )}
        />
      </View>

      <View className="flex-row justify-center gap-4 mt-10">
        <TouchableOpacity
          className="bg-[#30557f] py-4 rounded-full mb-4 items-center w-1/2"
          onPress={handleCall}
        >
          <Text className="text-white font-semibold text-lg">전화 걸기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 py-4 rounded-full mb-4 items-center w-1/2"
          onPress={handleBlock}
        >
          <Text className="text-white font-semibold text-lg">
            {blocked ? '차단됨' : '차단하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
