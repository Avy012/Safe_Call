import React, { useContext, useCallback, useState,useEffect  } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView,FlatList } from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from '../../context/UserContext';



const blockedUsers = [
  { id: '1', name: 'User A', number: '010-1111-1111' },
  { id: '2', name: 'User B', number: '010-2222-2222' },
  { id: '3', name: 'User C', number: '010-3333-3333' },
  { id: '4', name: 'User D', number: '010-4444-4444' },
  { id: '5', name: 'User E', number: '010-5555-5555' },
  { id: '6', name: 'User F', number: '010-6666-6666' },
  { id: '7', name: 'User G', number: '010-7777-7777' }
];



export default function Index() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [refresh, setRefresh] = useState(false);
  const [summaryData, setSummaryData] = useState({
  phoneNumber: '010-0000-0000', // 예시 전화번호
  summaryText: '통화 요약이 여기에 표시됩니다.', // 예시 요약
});
  useFocusEffect(
    useCallback(() => {
      setRefresh(prev => !prev); // 리렌더 유도
      console.log('포커스 시점의 최신 user:', user);
    }, [user])
  );
   // 밑에는 백엔드 연결되면, 최신 통화 요약 받아서 표시하기기
  //   useEffect(() => {
  //   const fetchCallSummary = async () => {
  //     // API 요청 보내기 (axios 또는 fetch 등 사용)
  //     const response = await fetch('https://api.example.com/call-summary?userId=123');
  //     const data = await response.json();

  //     // 받은 데이터로 state 업데이트
  //     setSummaryData({
  //       phoneNumber: data.phoneNumber,
  //       summaryText: data.summary,
  //     });
  //   };

  //   fetchCallSummary();
  // }, []);

  return (
    <View className="flex-1 bg-white">
       <View className="bg-primary px-4 py-4 ">
          <Text className="text-white text-2xl font-bold">                            Safe Call</Text>
        </View>
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 20 }]}>
      {/* 프로필 카드 */}
      
      <View style={styles.profileCard}>
        <View style={styles.rowContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.profileImage} />
          <Text style={styles.userName} numberOfLines={1}             
          ellipsizeMode="tail" >{user.name}</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Image
              source={require('../../assets/images/setting.png')}
              style={styles.settingsImage}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>차단</Text>
            <Text style={styles.statNumber}>2</Text>
          </View>
        </View>
      </View>
      <View style={styles.separator} />
  

   
    
    <Text style={styles.title}>AI Summary</Text>
      {/* 콜 요약 */}
      <View style={styles.Latest_Call_summary}>
        
        <Text style={styles.number}>{summaryData.phoneNumber}</Text>
        <Text>{summaryData.summaryText}</Text>
      </View>
      <View style={styles.separator} /> 
      {/* Blocked 리스트 제목 */}
      <Text style={styles.title}>차단 된 목록</Text>
      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.blockedCard}>
      <Text style={styles.blockedUserName}>
        {item.name}  ·  <Text style={styles.blockedUserNumber}>{item.number}</Text>
</Text>

      <TouchableOpacity style={styles.unblockButton}>
        <Text style={styles.unblockText}>해제</Text>
      </TouchableOpacity>
    </View>
  )}
/>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
  },
  profileCard: {
    width: 350,
    height: 175,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 7, height: 7 },
    shadowRadius: 30,
    elevation: 4,
    marginTop: 20,
    borderColor:'#F2F2F2'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    margin: 10,
    marginLeft:35,
    borderRadius: 50,
    borderColor:'#d1d5db',
    borderWidth:3
  },
  userName: {

    fontSize: 23,
    fontWeight: '700',
    color: '#222',
    maxWidth: 200,
    marginLeft:30
  },
  settingsButton: {
    position: 'absolute',
    top: 10,              // 상단에서 거리
    left:290,
    zIndex: 10, 
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  settingsImage: {
    width: 35,
    height: 35,
    backgroundColor: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    height: 50,
   
  },
  statBox: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 70
    
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f3f4f6',
    borderColor: '#A3B5C9',
    borderRadius: 12,
    elevation: 3,
    paddingVertical: 8,
    paddingHorizontal: 14,
    textAlign: 'center',
    width: 150,
    height: 45,
    margin: 10,
    marginTop:20
  },
  statLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B22222',
    marginTop: 8,
    marginRight:13,
    marginLeft:10
  },
  Latest_Call_summary: {
    width: 350,
    height: '20%',
    backgroundColor: '#f3f4f6',
    borderColor: '#A3B5C9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
    marginTop: 5,
    marginBottom: 15,
  },
  Card: {
    width: 350,
    minHeight: 65,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor:'#F2F2F2',
    padding: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 7, height: 7 },
    shadowRadius: 30,
    elevation: 3,
    marginVertical: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginLeft: 25,
    color: '#222',
    marginTop: 0,
    marginBottom: 10
  },
  title_summary:{
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'flex-start',
    color: '#222'
  },
  number : {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B22222',
    marginTop: 5,
    marginBottom:5
  },
  
  separator: {
    width: '100%',
    height: 2, // 디바이스가 표현할 수 있는 가장 얇은 선
    backgroundColor: '#F2F2F2',
    marginVertical: 30
  },
  blockedCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 12,
  marginVertical: 6,
  width: 350,
  alignSelf: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 5,
  elevation: 3,
  borderWidth: 1,
  borderColor: '#eee',
},

blockedProfileImage: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 15,
  backgroundColor: '#f3f3f3',
},

blockedUserName: {
  fontSize: 20,
  fontWeight: '600',
  color: '#333',
  flex: 1,
},

unblockButton: {
  backgroundColor: '#B22222',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
},

unblockText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},
blockedUserNumber: {
  fontSize: 14,
  color: '#888',
  fontWeight: '400',
},


})
