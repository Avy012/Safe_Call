import React, { useContext, useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext, useAuth } from '../../context/UserContext';
import { collection, doc, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Asset } from 'expo-asset';
import { getCallLogs } from '@/services/callLogStorage';



export default function Index() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { user1 } = useAuth();

  const [refresh, setRefresh] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<{ id: string; name: string; phone?: string }[]>([]);
  const [summaryData, setSummaryData] = useState({
    phoneNumber: '010-0000-0000',
    summaryText: '통화 요약이 여기에 표시됩니다.',
  });

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [transcription, setTranscription] = useState('');

  const formatPhoneNumber = (num: string) => {
    if (!num || num.length !== 11) return num; // return as-is if invalid
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  };

  useEffect(() => {
    console.log('🧠 User loaded:', user1);
  }, [user1]);

  // 차단 해제 함수
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


  useEffect(() => {
    const loadRecentNumber = async () => {
      try {
        const logs = await getCallLogs();

        const sortedLogs = logs.sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );

        if (sortedLogs.length > 0) {
          const recentPhone = sortedLogs[0].phone || '알 수 없음';
          setSummaryData(prev => ({
            ...prev,
            phoneNumber: recentPhone,
          }));
        } else {
          setSummaryData(prev => ({
            ...prev,
            phoneNumber: '기록 없음',
          }));
        }
      } catch (err) {
        console.error('❌ Failed to load recent call from local:', err);
      }
    };

    loadRecentNumber();
  }, []);


  // 화면 포커스 시 refresh 토글
  useFocusEffect(
    useCallback(() => {
      setRefresh(prev => !prev);
    }, [user])
  );

  // 차단 목록 불러오기
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

  // 수신 콜 실시간 감지
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(doc(db, 'calls', user.uid), (docSnap) => {
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      const callerId = data.callId;

      const isBlocked = blockedUsers.some(user => user.id === callerId);
      if (isBlocked) {
        console.log('차단유저 전화시도:', callerId);
        return; // 차단 유저 전화 무시
      }

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
    });

    return () => unsubscribe();
  }, [user?.uid, blockedUsers]);

  // Expo 푸시 알림 토큰 요청
  useEffect(() => {
    const getPushToken = async () => {
      console.log('getPushToken started');

      if (!Device.isDevice) {
        console.log(' Not a physical device');
        return;
      }

      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        console.log('🔐 Existing permission status:', existingStatus);

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
          console.log('Requested new permission:', finalStatus);
        }

        if (finalStatus !== 'granted') {
          console.log('Permission not granted');
          return;
        }

        const { data: token } = await Notifications.getExpoPushTokenAsync();
        console.log('✅ Push Token:', token);

      } catch (err) {
        console.error(' Error getting push token:', err);
      }
    };

    getPushToken();
  }, []);

  // STT + OpenAI 람다 호출해 요약 가져오기
  const fetchCallSummary = async () => {
    setLoadingSummary(true);
    setTranscription('');
    setSummaryData(prev => ({ ...prev, summaryText: '분석 중입니다...' }));

    const copyScenarioFile = async () => {
      const asset = Asset.fromModule(require('../../assets/scenario2.wav'));
      await asset.downloadAsync(); // ensure file is available

      const dest = FileSystem.documentDirectory + 'scenario2.wav';
      await FileSystem.copyAsync({
        from: asset.localUri!,
        to: dest,
      });

      console.log('✅ File copied to:', dest);
    };

    try {
      await copyScenarioFile();
      const audioFileUri = FileSystem.documentDirectory + 'scenario2.wav';

      // scenario1.wav 파일 base64 읽기
      const fileBase64 = await FileSystem.readAsStringAsync(audioFileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // STT 람다 호출
      const sttLambdaUrl = 'https://usyvahybz2.execute-api.us-east-1.amazonaws.com/dev/audio';
      const sttResponse = await axios.post(sttLambdaUrl, { audio: fileBase64 });
      const text = sttResponse.data.body || '';

      setTranscription(text);

      if (!text) {
        setSummaryData(prev => ({ ...prev, summaryText: 'STT 결과가 없습니다.' }));
        setLoadingSummary(false);
        return;
      }

     // OpenAI 람다 호출
    const openAiLambdaUrl = 'https://usyvahybz2.execute-api.us-east-1.amazonaws.com/dev/SummationText';
    const openAiResponse = await axios.post(openAiLambdaUrl, { text });

    console.log('🔍 Full OpenAI Lambda response:', openAiResponse.data);

    let aiResult = 'OpenAI 응답이 없습니다.';
6
    try {
      // First: parse the outer "body"
      const bodyParsed = JSON.parse(openAiResponse.data.body);

      // Second: if that body has a "result" key, use it
      aiResult = bodyParsed.result || '요약 없음';
    } catch (e) {
      console.warn('⚠️ JSON parse failed, using raw body');
      aiResult = openAiResponse.data.body || '응답 없음';
    }

    setSummaryData(prev => ({
      ...prev,
      summaryText: aiResult,
    }));


    } catch (error) {
      console.error('Summary fetch error:', error);
      setSummaryData(prev => ({ ...prev, summaryText: '요약을 불러오는 중 오류가 발생했습니다.' }));
    } finally {
      setLoadingSummary(false);
    }
  };

  // 화면 진입 시 요약 자동 호출
  useEffect(() => {
    fetchCallSummary();
  }, []);

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
            className="w-[175px] h-[50px]"
            resizeMode="contain"
          />
        </View>

        {/* 콜 요약 */}
        <View className="w-[350px] bg-white rounded-xl p-4 shadow-md border border-blue-200 mt-2 mb-6">
          {loadingSummary ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <Text className="text-red-700 font-bold mb-1">{formatPhoneNumber(summaryData.phoneNumber)}</Text>
              <Text className="text-gray-800">{summaryData.summaryText}</Text>
            </>
          )}
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
                {item.phone && <Text className="text-base text-gray-600">{formatPhoneNumber(item.phone)}</Text>}
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
