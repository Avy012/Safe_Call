import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
export default function SettingsScreen() {
  const router = useRouter(); 
  const { user } = useContext(UserContext);

  return (
    
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-4 p-2 bg-white rounded-lg z-10">
                                <Text className="text-5xl text-primary-1000">←</Text>
                              </TouchableOpacity>
      {/* 사용자 정보 */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.imageUri }} style={styles.profileImage} />
        <Text style={styles.username}>{user.name}</Text>
      </View>

      {/* 버튼들 */}
      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/account')}>
          <Image
            source={require('../assets/icons/account.png')} 
            style={styles.icon2}/>
        <Text style={styles.buttonText}>계정</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/privacy')}
      >
        <Image
            source={require('../assets/icons/unlock.png')} 
            style={styles.icon}
          />
        <Text style={styles.buttonText}>개인정보 보호</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={() => router.push('/notification')}
      >
        <Image
            source={require('../assets/icons/notification.png')} 
            style={styles.icon}
          />
        <Text style={styles.buttonText}>알림 설정</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
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
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 4,
  },
  buttonText: {
    marginLeft:10,
    marginBottom:0,
    fontSize: 16,
    color: '#333',
  },
  icon:{
    width: 25,
    height: 25,
    marginRight: 12,
  },
  icon2:{
    width: 20,
    height: 20,
    marginRight: 12,
  },
});
