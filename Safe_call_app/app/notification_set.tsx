import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { setScenario } from '@/services/scenarioStore'; // ✅ import setter

const Notification = () => {
  const router = useRouter(); 
  const [callAlerts, setCallAlerts] = useState(true);
  const [spamBlockAlerts, setSpamBlockAlerts] = useState(true);
  const [appUpdates, setAppUpdates] = useState(false);

  const getScenarioNumber = () => {
    if (callAlerts && !spamBlockAlerts && !appUpdates) return 4;
    if (!callAlerts && spamBlockAlerts && !appUpdates) return 5;
    if (!callAlerts && !spamBlockAlerts && appUpdates) return 6;
    return 0;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          const scenario = getScenarioNumber();
          await setScenario(scenario.toString());
          router.replace('/settings');
        }}
        className="absolute top-4 left-4 p-2 bg-white rounded-lg z-10"
      >
        <Text className="text-3xl text-primary-1000">←</Text>
      </TouchableOpacity>


      <Text style={styles.title}>알림 설정</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>수신 전화 알림</Text>
        <Switch value={callAlerts} onValueChange={setCallAlerts} />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>차단 전화 수신시 알림</Text>
        <Switch value={spamBlockAlerts} onValueChange={setSpamBlockAlerts} />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>앱 업데이트 소식</Text>
        <Switch value={appUpdates} onValueChange={setAppUpdates} />
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

export default Notification;
