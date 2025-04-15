import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router'; // 추가된 부분

const Keypad: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const router = useRouter(); // 추가된 부분

  // 숫자 버튼 눌렀을 때 실행되는 함수
  const handleButtonPress = (number: string): void => {
    setPhoneNumber((prev) => prev + number);
  };

  // 마지막 숫자 삭제
  const handleDelete = (): void => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  // 전화 걸기
  const handleCall = (): void => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url).catch((err) => console.error('전화 걸기 실패', err));
    } else {
      console.error('전화번호가 비어있습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

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
        <ImageBackground
          source={require('../assets/images/callImage.png')}
          style={styles.action_call}
        >
          <TouchableOpacity onPress={handleCall} style={styles.action_call} />
        </ImageBackground>

        <ImageBackground
          source={require('../assets/images/delete_number.png')}
          style={styles.action_delete}
        >
          <TouchableOpacity style={styles.action_delete} onPress={handleDelete} />
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    zIndex: 10,
  },
  backText: {
    fontSize: 40,
    color: '#333',
  },
  phoneNumber: {
    fontSize: 32,
    marginBottom: 150,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 330,
    height: 220,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  button: {
    width: 100,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 9,
    backgroundColor: 'rgba(208, 205, 205, 100)',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 28,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 70,
  },
  action_delete: {
    width: 50,
    height: 50,
    margin: 20,
    padding: 10,
    borderRadius: 15,
  },
  action_call: {
    width: 65,
    height: 65,
    margin: 10,
    padding: 10,
    borderRadius: 15,
  },
});

export default Keypad;
