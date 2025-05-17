// EditProfile.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '@/context/UserContext';

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [imageUri, setImageUri] = useState(user.imageUri);
  const router = useRouter();

  const handleSaveAndExit = () => {
    setUser({ name, phone, imageUri });
    Alert.alert('저장 완료', '프로필이 수정되었습니다.');
    router.back();
  };

  const handleImageUpdate = () => {
    const newImage = 'https://randomuser.me/api/portraits/women/65.jpg';
    setImageUri(newImage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={{ fontSize: 30 }}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>계정 정보 수정</Text>

      <Image source={{ uri: imageUri }} style={styles.profileImage} />
      <TouchableOpacity style={styles.button} onPress={handleImageUpdate}>
        <Text style={styles.buttonText}>프로필 사진 수정</Text>
      </TouchableOpacity>

      <Text style={styles.label}>계정 이름</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>전화번호</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveAndExit}>
        <Text style={styles.buttonText}>저장하고 나가기</Text>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
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
