import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const Notification = () => {
  const [callAlerts, setCallAlerts] = useState(true);
  const [chatMessages, setChatMessages] = useState(true);
  const [appUpdates, setAppUpdates] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림 설정</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>수신 전화 알림</Text>
        <Switch
          value={callAlerts}
          onValueChange={setCallAlerts}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>채팅 메시지 알림</Text>
        <Switch
          value={chatMessages}
          onValueChange={setChatMessages}
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
      fontSize: 24,
      fontWeight: '700',
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
