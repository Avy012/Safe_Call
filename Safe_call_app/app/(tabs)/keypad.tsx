import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';

const Keypad: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleButtonPress = (number: string): void => {
    setPhoneNumber((prev) => prev + number);
  };

  const handleDelete = (): void => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = (): void => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url).catch((err) =>
        console.error('전화 걸기 실패', err)
      );
    } else {
      console.error('전화번호가 비어있습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phoneNumber}>{phoneNumber}</Text>

      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(
          (button) => (
            <TouchableOpacity
              key={button}
              style={styles.button}
              onPress={() => handleButtonPress(button)}
            >
              <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.actions}>
        {/* 전화 버튼 */}
        <TouchableOpacity onPress={handleCall} style={styles.iconButton}>
          <Image
            source={require('../../assets/images/callImage.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>

        {/* 지우기 버튼 */}
        <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
          <Image
            source={require('../../assets/images/delete_number.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>
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
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'rgba(208, 205, 205, 100)',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 28,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 60,
  },
  iconButton: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
     width: 65,
      height: 65,
      resizeMode: 'contain',
  },
});

export default Keypad;
