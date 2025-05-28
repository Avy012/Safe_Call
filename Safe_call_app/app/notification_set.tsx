import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet,TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
const Notification = () => {
  const router = useRouter(); 
  const [callAlerts, setCallAlerts] = useState(true);
  const [spamBlockAlerts, setSpamBlockAlerts] = useState(true);
  const [appUpdates, setAppUpdates] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace('/settings')}
        className="absolute top-2 left-5 p-2 bg-white rounded-lg z-10"
        style={{ top: 4, left: 0 }} // ⬅ move up and left
      >
        <Text className="text-4xl text-primary-1000">←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>알림 설정</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>수신 전화 알림</Text>
        <Switch
          value={callAlerts}
          onValueChange={setCallAlerts}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>차단 전화 수신시 알림</Text>
        <Switch
          value={spamBlockAlerts}
          onValueChange={setSpamBlockAlerts}
        />
      </View>



      <View style={styles.optionRow}>
        <Text style={styles.optionText}>앱 업데이트 소식</Text>
        <Switch
          value={appUpdates}
          onValueChange={setAppUpdates}
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
  
export default Notification;
