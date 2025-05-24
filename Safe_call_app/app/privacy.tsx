import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Platform, ToastAndroid, Alert } from 'react-native';
import { useRouter } from "expo-router";

const Privacy = () => {
  const router = useRouter(); 
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [allowCallsFromUnknown, setAllowCallsFromUnknown] = useState(false);
  const [saveCallHistory, setSaveCallHistory] = useState(true);

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('알림', message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace('/settings')}
        className="absolute top-2 left-5 p-2 bg-white rounded-lg z-10"
        style={{ top: 4, left: 0 }} // ⬅ move up and left
      >
        <Text className="text-4xl text-primary-1000">←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>개인정보 보호 설정</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>프로필 공개</Text>
        <Switch
          value={isProfilePublic}
          onValueChange={(val) => {
            setIsProfilePublic(val);
            showToast(`프로필 공개가 ${val ? '활성화' : '비활성화'}되었습니다.`);
          }}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>모르는 사람의 전화 허용</Text>
        <Switch
          value={allowCallsFromUnknown}
          onValueChange={(val) => {
            setAllowCallsFromUnknown(val);
            showToast(`모르는 사람의 전화 허용이 ${val ? '활성화' : '비활성화'}되었습니다.`);
          }}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>통화 기록 저장</Text>
        <Switch
          value={saveCallHistory}
          onValueChange={(val) => {
            setSaveCallHistory(val);
            showToast(`통화 기록 저장이 ${val ? '활성화' : '비활성화'}되었습니다.`);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    marginBottom: 30,
    alignSelf: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default Privacy;
