import { Text, View, Image, StyleSheet, TouchableOpacity ,ScrollView} from "react-native";
import { useRouter } from "expo-router"; // Expo Router 쓰니까 추가해

const blockedUsers = [
  { id: '1', name: 'User A' },
  { id: '2', name: 'User B' },
  { id: '3', name: 'User C' },
  { id: '4', name: 'User D' },
];

export default function Index() {
  const router = useRouter(); // 이동하려면 useRouter() 필요

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        {/* 설정(Settings) 버튼 */}
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => router.push('/settings')}
        >
          <Image
          source={require('../../assets/images/setting.png')}
          style={styles.settingsImage}
        />
        </TouchableOpacity>
        <View  style={styles.rowContainer}>

        {/* 프로필 사진 */}
        <Image
          source={require('../../assets/images/profile.png')}
          style={styles.profileImage}
        />

        {/* 사용자 이름 */}
        <Text style={styles.userName}>John Doe</Text>

        
        </View>

        {/* 통계 영역 */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Reported</Text>
            <Text style={styles.statNumber}>5</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Blocked</Text>
            <Text style={styles.statNumber}>2</Text>
          </View>
        </View>
      </View>


      <Text style={styles.userName2}>Latest Call summary</Text>
      <View style={styles.Latest_Call_summary}>
        <Text>전화번호 예시</Text>
        <Text>AI Summary</Text>
        <Text>연락을 원하는 상대방과의 대화</Text>



      </View>

      <Text style={styles.userName2}>Blocked List</Text>

      {/* Blocked 사용자 리스트 */}
      {blockedUsers.map((user) => (
        <View key={user.id} style={styles.Card}>
          <Text style={styles.blockedUserName}>{user.name}</Text>
        </View>
      ))}

    </ScrollView>
  );
}

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // 중앙 배치
    alignItems: 'center',
    padding: 10,
  },
  profileCard: {
    width: '90%',
    height: 180,
    backgroundColor: '#A3B5C9',
    borderRadius: 12,
    padding: 0,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 1,
    marginTop:100
  },

Card:{
  width: '90%',
  height: '10%',
  backgroundColor: '#A3B5C9',
  borderRadius: 12,
  padding: 10,
  alignItems: 'flex-start',
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 5 },
  shadowRadius: 10,
  elevation: 1,
  margin:1
}  ,
 
Latest_Call_summary:{
    width: '90%',
    height: '27%',
    backgroundColor: '#A3B5C9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 1,
    margin:10

  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 0,
    backgroundColor: '#EEE',
    borderRadius: 20,
  },
  settingsImage: {
    width: 35,
    height: 35,
    margin:0,
    backgroundColor:'#A3B5C9'
  },
  rowContainer: {
    flexDirection: 'row',  // 가로로 정렬
    alignItems: 'center',  // 가운데 정렬
    gap: 0, // 요소들 사이 간격 (또는 marginRight 사용해도 됨)
  },
  profileImage: {
    width: 65,
    height: 65,
    margin:20,
    borderRadius: 50, // 동그란 프로필
    marginBottom: 15,
  },
  userName: {
    marginLeft:20,
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    
  },
  userName2: {
    fontSize: 23,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginLeft: 30,
    color: '#222',
    
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statBox: {
    marginTop:0,
    flexDirection: 'row',  
    alignItems: 'center',  
    gap: 10, 
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8, // 위아래 여백
    paddingHorizontal: 14, // 좌우 여백
    textAlign: 'center', // 텍스트 중앙 정렬
    width:65,
    height:45
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B22222',
    marginTop: 8,
  },
});
