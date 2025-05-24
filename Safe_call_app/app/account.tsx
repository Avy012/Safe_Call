import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '@/context/UserContext';

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  // Local state (start empty, populate with useEffect)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUri, setImageUri] = useState('');

  // 🧠 Update local state once user is loaded
  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setPhone(user.phone ?? '');
      setImageUri(user.imageUri ?? '');
    }
  }, [user]);

  // Save changes to context
  const handleSaveAndExit = () => {
    if (!name || !phone) {
      Alert.alert('입력 오류', '이름과 전화번호를 모두 입력해주세요.');
      return;
    }

    setUser(prev => ({
      ...prev,
      name,
      phone,
      imageUri,
    }));

    Alert.alert('저장 완료', '프로필이 수정되었습니다.');
    router.back();
  };

  // Mock image change
  const handleImageUpdate = () => {
    const newImage = 'https://randomuser.me/api/portraits/women/65.jpg';
    setImageUri(newImage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace('/settings')}
        style={[styles.backButton, { top: 4, left: 0 }]}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>계정 정보 수정</Text>

      <Image source={{ uri: imageUri }} style={styles.profileImage} />
      <TouchableOpacity style={styles.button} onPress={handleImageUpdate}>
        <Text style={styles.buttonText}>사진 수정</Text>
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
        <Text style={styles.buttonText}>저장</Text>
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
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 32,
    color: '#1E3A5F',
  },
  title: {
    fontSize: 20,
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
