import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,  Linking

 } from 'react-native';

// Phone number 상태 타입 정의
const Keypad: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // 숫자 버튼 눌렀을 때 실행되는 함수
  const handleButtonPress = (number: string): void => {
    setPhoneNumber((prev) => prev + number);
  };

  // 전화번호 초기화
  const handleClear = (): void => {
    setPhoneNumber('');
  };

  // 마지막 숫자 삭제
  const handleDelete = (): void => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };
  // 전화 걸기
  const handleCall = (): void => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error('전화 걸기 실패', err));
  };


  return (
    <View style={styles.container}>
      <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((button) => (
          <TouchableOpacity
            key={button}
            style={styles.button}
            onPress={() => handleButtonPress(button)}
          >
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Del</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 32,
    marginBottom: 20,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    justifyContent: 'space-between',
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#5A8F91',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 24,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#5A8F91',
    borderRadius: 20,
  },
});

export default Keypad;
