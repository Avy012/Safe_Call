import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { setScenario } from '@/services/scenarioStore'; // ✅ import the setter

const Privacy = () => {
  const router = useRouter(); 
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [allowCallsFromUnknown, setAllowCallsFromUnknown] = useState(false);
  const [saveCallHistory, setSaveCallHistory] = useState(true);

  const getPrivacyScenarioNumber = () => {
    if (isProfilePublic && !allowCallsFromUnknown && !saveCallHistory) return 1;
    if (!isProfilePublic && allowCallsFromUnknown && !saveCallHistory) return 2;
    if (!isProfilePublic && !allowCallsFromUnknown && saveCallHistory) return 3;
    return 0;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          const scenario = getPrivacyScenarioNumber();
          await setScenario(scenario.toString());
          router.replace('/settings');
        }}
        className="absolute top-4 left-4 p-2 bg-white rounded-lg z-10"
      >
        <Text className="text-3xl text-primary-1000">←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>개인정보 보호 설정</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>프로필 공개</Text>
        <Switch value={isProfilePublic} onValueChange={setIsProfilePublic} />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>모르는 사람의 전화 허용</Text>
        <Switch value={allowCallsFromUnknown} onValueChange={setAllowCallsFromUnknown} />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>통화 기록 저장</Text>
        <Switch value={saveCallHistory} onValueChange={setSaveCallHistory} />
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
