import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../services/firebaseConfig';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/UserContext'; // adjust if needed


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { setUser } = useAuth();


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (uri: string, userId: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `profilePics/${userId}.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSignup = async () => {
    if (!email || !password || !phone || !name || !imageUri) {
      Alert.alert('모든 정보를 입력하고 사진을 업로드해주세요.');
      return;
    }

    try {
      setUploading(true);
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      // Upload image to Firebase Storage
      const uploadedUrl = await uploadImageToFirebase(imageUri, user.uid);

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        phone,
        profilePic: uploadedUrl,
        email,
        created_at: new Date().toISOString(),
      });

      await updateProfile(user, {
        displayName: name,
        photoURL: uploadedUrl,
      });
      
      setUser({
        uid: user.uid,
        name,
        phone,
        imageUri: uploadedUrl,
      });


      await sendEmailVerification(user);
      Alert.alert('이메일 인증 메일이 발송되었습니다. 메일함을 확인해주세요.');

      router.replace('/login');
    } catch (err: any) {
      Alert.alert('회원가입 실패: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-2xl font-bold text-primary mb-6">Create Account</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-md"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-md"
        />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-md"
        />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          className="w-full h-12 px-4 mb-4 border border-gray-300 rounded-md"
        />

        <TouchableOpacity onPress={pickImage} className="mb-4">
          <Text className="text-blue-600 underline">
            {imageUri ? '📷 사진 변경하기' : '📷 프로필 사진 선택'}
          </Text>
        </TouchableOpacity>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 12 }}
          />
        )}

        <TouchableOpacity
          onPress={handleSignup}
          disabled={uploading}
          className="w-full h-12 bg-primary rounded-md items-center justify-center"
        >
          <Text className="text-white text-lg font-semibold">
            {uploading ? '가입 중...' : 'SIGN UP'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
