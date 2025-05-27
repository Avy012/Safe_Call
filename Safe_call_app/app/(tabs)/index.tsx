import React, { useContext, useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../../context/UserContext';
import { collection, doc, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export default function Index() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [refresh, setRefresh] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<{ id: string; name: string; phone?: string }[]>([]);
  const [summaryData, setSummaryData] = useState({
    phoneNumber: '010-0000-0000',
    summaryText: '통화 요약이 여기에 표시됩니다.',
  });

  // ✅ Handle unblock
  const handleUnblock = async (blockedUserId: string) => {
    try {
      if (!user?.uid) return;
      await deleteDoc(doc(db, `users/${user.uid}/blockedUsers/${blockedUserId}`));
      setBlockedUsers(prev => prev.filter(user => user.id !== blockedUserId));
      console.log(`✅ Unblocked user: ${blockedUserId}`);
    } catch (err) {
      console.error('❌ Failed to unblock user:', err);
    }
  };

  // ✅ Refresh on focus
  useFocusEffect(
    useCallback(() => {
      setRefresh(prev => !prev);
    }, [user])
  );

  // ✅ Fetch blocked users
  useEffect(() => {
    let isMounted = true;

    const fetchBlocked = async () => {
      if (!user?.uid) return;
      try {
        const snap = await getDocs(collection(db, `users/${user.uid}/blockedUsers`));
        const list = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '이름 없음',
            phone: data.phone || '알 수 없음',
          };
        });
        if (isMounted) setBlockedUsers(list);
      } catch (err) {
        console.error('❌ Failed to fetch blocked users:', err);
      }
    };

    fetchBlocked();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, refresh]);

  // ✅ Listen for incoming calls
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(doc(db, 'calls', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        router.push({
          pathname: '/IncomingCallScreen',
          params: {
            name: data.name,
            phone: data.phone,
            token: data.token,
            roomName: data.roomName,
            callId: data.callId,
            profilePic: data.profilePic,
          },
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">🔄 사용자 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary px-4 py-4">
        <Text className="text-white text-2xl font-bold">Safe Call</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        {/* 프로필 카드 */}
        <View className="w-[350px] h-[120px] bg-white rounded-xl p-4 shadow-md mt-5 mb-2 border border-gray-100 justify-center">
          <View className="flex-row items-center">
            <Image
              source={{ uri: user.imageUri || 'https://via.placeholder.com/100' }}
              className="w-[75px] h-[75px] ml-10 mr-4 rounded-full border-2 border-gray-300"
            />
            <View className="flex-1 justify-center ml-5">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold text-gray-900" numberOfLines={1} ellipsizeMode="tail">
                  {user.name}
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                <Text className="text-red-700 font-bold text-base mr-2">차단</Text>
                <Text className="text-gray-800 bg-gray-100 rounded-lg px-3 py-1 font-bold shadow">
                  {blockedUsers.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* AI Summary 이미지 왼쪽 정렬 */}
        <View className="w-full items-start px-5 mt-4 mb-2">
          <Image
            source={require('../../assets/images/aisummary.png')}
            className="w-[155px] h-[50px]"
            resizeMode="contain"
          />
        </View>

        {/* 콜 요약 */}
        <View className="w-[350px] bg-white rounded-xl p-4 shadow-md border border-blue-200 mt-2 mb-6">
          <Text className="text-red-700 font-bold mb-1">{summaryData.phoneNumber}</Text>
          <Text className="text-gray-800">{summaryData.summaryText}</Text>
        </View>

        {/* 차단 목록 타이틀 */}
        <View className="w-full items-start px-5 mt-2 mb-2">
          <Image
            source={require('../../assets/images/blocked_list.png')}
            className="w-[115px] h-[40px]"
            resizeMode="contain"
          />
        </View>


        {/* 차단된 사용자 목록 */}
        {blockedUsers.map((item) => (
          <View
            key={item.id}
            className="w-[350px] min-h-[65px] bg-gray-50 rounded-xl border border-blue-200 p-3 shadow-lg mb-2"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg text-red-700">{item.name}</Text>
                {item.phone && <Text className="text-base text-gray-600">{item.phone}</Text>}
              </View>
              <Text
                onPress={() => handleUnblock(item.id)}
                className="text-sm text-blue-700 font-semibold px-3 py-2 bg-blue-100 rounded-full overflow-hidden"
              >
                차단 해제
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
