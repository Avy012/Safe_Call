import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { Alert } from 'react-native';


export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  return (
    <View style={styles.container}>
      {/* 사용자 정보 카드 */}
      <View style={styles.profileContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.profileImage} />
          <Text style={styles.username}>{user.name}</Text>
        </View>


      

      {/* 버튼 목록 */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/account')}>
        <Ionicons name="person-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.buttonText}>계정</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/privacy')}>
        <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.buttonText}>개인 정보 보호</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/notification')}>
        <Ionicons name="notifications-outline" size={20} color="#333" style={styles.icon} />
        <Text style={styles.buttonText}>알림 설정</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => {
          Alert.alert(
            '로그아웃 확인',
            '정말 로그아웃하시겠습니까?',
            [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '로그아웃',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await signOut(auth);
                    router.replace('/before_login');
                  } catch (error) {
                    console.log('Logout error:', error);
                  }
                },
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.icon} />
        <Text style={[styles.buttonText, { color: '#fff' }]}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    elevation:2
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 16,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#f0f2f5',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation:2
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4d4f',
    elevation:2
  },
});
