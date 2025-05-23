// EditProfile.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '@/context/UserContext';
import * as ImagePicker from 'expo-image-picker';


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

  const handleImageUpdate = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setImageUri(result.assets[0].uri);
  }
};

  return (
    <View style={styles.container}>
         <TouchableOpacity onPress={() => router.back()} className="absolute top-2 left-4 p-2 bg-white rounded-lg z-10">
              <Text className="text-5xl text-primary-1000">←</Text>
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
        <Text style={styles.buttonText}>저장 </Text>
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
