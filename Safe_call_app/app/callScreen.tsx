import { View, Text, TouchableOpacity, Image,StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import ScamAlertBanner from './scam_alert';

const isScam = true; // 또는 false로 테스트 가능

export default function CallScreen() {
  const { name, phone } = useLocalSearchParams();
  const router = useRouter();

  const displayName = name || 'Unknown';
  const displayPhone = phone || '번호 없음';

  return (
    <View className="flex-1 bg-black justify-between items-center pt-16 pb-10 px-4">
      {/* 프로필 이미지 자리 */}
      {isScam &&<ScamAlertBanner phoneNumber="010-1234-5678" />
}
      <View className="items-center">
        <View className="w-28 h-28 rounded-full bg-gray-700 mb-4" />
        <Text className="text-white text-2xl font-semibold">{displayName}</Text>
        <Text className="text-gray-400 text-sm mt-1">{displayPhone}</Text>
      </View>

      {/* 통화 시간 */}
      <Text className="text-white text-base mt-6">01:12</Text>

      {/* 기능 버튼 3개 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 24, marginTop: 48 }}>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => alert('Muted')}>
          <View style={styles.iconCircle}>
            <Image source={require('../assets/icons/mute.png')} style={styles.icon} />
          </View>
          <Text style={styles.iconLabel}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconWrapper} onPress={() => alert('Speaker On')}>
          <View style={styles.iconCircle}>
            <Image source={require('../assets/icons/speaker.png')} style={styles.icon} />
          </View>
          <Text style={styles.iconLabel}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconWrapper} onPress={() => alert('Video')}>
          <View style={styles.iconCircle}>
            <Image source={require('../assets/icons/video.png')} style={styles.icon} />
          </View>
          <Text style={styles.iconLabel}>Video</Text>
        </TouchableOpacity>
      </View>

      {/* 통화 종료 버튼 */}
      <TouchableOpacity style={styles.iconWrapper} onPress={() => alert('Video')}>
        
            <Image source={require('../assets/icons/deny.png')} style={styles.icon2} />
          
          <Text style={styles.iconLabel}>End</Text>
        </TouchableOpacity>
    </View>
  ); // ✅ 여기서 return 블록을 닫아줘야 함
}

// ✅ return 블록 닫은 다음에 스타일 선언
const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconCircle: {
    width: 70,
    height: 70,
    backgroundColor: '#444',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 34,
    height: 34,
  },
  icon2:{
    width: 60,
    height: 60,
    margin:10
  },
  iconLabel: {
    color: '#fff',
    fontSize: 14,
  },
});
