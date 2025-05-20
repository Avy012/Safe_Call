import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig"; // adjust path if needed


export default function SettingsScreen() {
  const router = useRouter(); 
  return (
    
    <View style={styles.container}>
      {/* 사용자 정보 */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>John Doe</Text>
      </View>

      {/* 버튼들 */}
      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/account')}
        >
        <Text style={styles.buttonText}>Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/privacy')}
      >
        <Text style={styles.buttonText}>Privacy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/notification')}
      >
        <Text style={styles.buttonText}>Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ff4d4f' }]}
        onPress={async () => {
          try {
            await signOut(auth);
            router.replace('/before_login'); // go back to login screen
          } catch (error) {
            console.log("Logout error:", error);
          }
        }}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});
