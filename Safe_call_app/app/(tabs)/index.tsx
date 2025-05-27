import React, { useContext, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../../context/UserContext';

const blockedUsers = [
  { id: '1', name: 'User A' },
  { id: '2', name: 'User B' },
  { id: '3', name: 'User C' },
  { id: '4', name: 'User D' },
  { id: '5', name: 'User E' },
  { id: '6', name: 'User F' },
  { id: '7', name: 'User G' }
];

export default function Index() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [refresh, setRefresh] = useState(false);
  const [summaryData, setSummaryData] = useState({
    phoneNumber: '010-0000-0000',
    summaryText: '통화 요약이 여기에 표시됩니다.',
  });

  useFocusEffect(
    useCallback(() => {
      setRefresh(prev => !prev);
      console.log('포커스 시점의 최신 user:', user);
    }, [user])
  );

  // ✅ Guard: show loading until user is loaded
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">🔄 사용자 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary px-4 py-4">
        <Text className="text-white text-2xl font-bold">Safe Call</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 20 }]}>
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: user.imageUri || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{user.name}</Text>
                {/* 통화 화면으로 이동 버튼 */}
                  <TouchableOpacity onPress={() => router.push(`/callScreen?name=최근통화&phone=${summaryData.phoneNumber}`)}>
                    <Text>통화 화면으로 이동</Text>
                  </TouchableOpacity>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>차단</Text>
                <Text style={styles.statNumber}>7</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-2xl font-bold mb-6">Safe Call</Text>
        </View>

        <View className="flex-row items-end mb-2 px-0 w-auto">
          <Image
            source={require('../../assets/images/aisummary.png')}
            style={styles.aisumarryImage}
          />
        </View>

        {/* 콜 요약 */}
        <View style={styles.Latest_Call_summary}>
          <Text style={styles.number}>{summaryData.phoneNumber}</Text>
          <Text>{summaryData.summaryText}</Text>
        </View>

        {/* Blocked 리스트 제목 */}
        <Image
          source={require('../../assets/images/blocked_list.png')}
          style={styles.Blocked_listImage}
        />

        {blockedUsers.map(item => (
          <View key={item.id} style={styles.Card}>
            <Text style={styles.blockedUserName}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    padding: 10,
  },
  profileCard: {
    width: 350,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 2,
    marginTop: 20,
    marginBottom: 10,
    borderColor: '#F2F2F2',
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 75,
    height: 75,
    left: 40,
    margin: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flexShrink: 1,
  },
  statBox: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B22222',
    marginRight: 10,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  Latest_Call_summary: {
    width: 350,
    height: '20%',
    backgroundColor: '#FFFFFF',
    borderColor: '#A3B5C9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 2,
    marginTop: 5,
    marginBottom: 20,
  },
  Card: {
    width: 350,
    minHeight: 65,
    alignSelf: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderColor: '#A3B5C9',
    padding: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 7, height: 7 },
    shadowRadius: 30,
    elevation: 2,
    marginVertical: 5,
  },
  blockedUserName: {
    fontSize: 17,
    color: '#B22222',
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginLeft: 25,
    color: '#222',
    marginTop: 0,
    marginBottom: 10,
  },
  title_summary: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'flex-start',
    color: '#222',
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B22222',
    marginTop: 5,
    marginBottom: 5,
  },
  separator: {
    width: '95%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 35,
  },
  aisumarryImage:{
    right:100,
    width:170,
    height: 50,
    resizeMode: 'contain' ,
    marginTop:20
  }, 
  Blocked_listImage:{
    right:120,
    width:130,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop: 10,
  },
});
