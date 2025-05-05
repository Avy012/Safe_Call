import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

const EditProfile = () => {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('010-1234-5678');
  const [imageUri, setImageUri] = useState('https://randomuser.me/api/portraits/men/75.jpg');

  const handleNameUpdate = () => {
    Alert.alert('이름 수정', `새 이름: ${name}`);
  };

  const handlePhoneUpdate = () => {
    Alert.alert('전화번호 수정', `새 전화번호: ${phone}`);
  };

  const handleImageUpdate = () => {
    Alert.alert('이미지 수정', '프로필 이미지를 변경합니다 (예시)');
    // 여기에 이미지 선택 로직 추가 가능
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>계정 정보 수정</Text>

      {/* 프로필 이미지 */}
      <Image source={{ uri: imageUri }} style={styles.profileImage} />
      <TouchableOpacity style={styles.button} onPress={handleImageUpdate}>
        <Text style={styles.buttonText}>프로필 사진 수정</Text>
      </TouchableOpacity>

      {/* 이름 입력 */}
      <Text style={styles.label}>계정 이름</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="이름을 입력하세요"
      />
      <TouchableOpacity style={styles.button} onPress={handleNameUpdate}>
        <Text style={styles.buttonText}>이름 수정</Text>
      </TouchableOpacity>

      {/* 전화번호 입력 */}
      <Text style={styles.label}>전화번호</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="전화번호를 입력하세요"
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handlePhoneUpdate}>
        <Text style={styles.buttonText}>전화번호 수정</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginVertical: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 15,
    },
    label: {
      alignSelf: 'flex-start',
      fontSize: 16,
      marginTop: 15,
      fontWeight: '600',
    },
    input: {
      width: '100%',
      height: 45,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginTop: 8,
    },
    button: {
      backgroundColor: '#1E3A5F',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 10,
      marginTop: 12,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  
export default EditProfile;
