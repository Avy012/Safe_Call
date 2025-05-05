import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router"; // Expo Router 사용

const blockedUsers = [
  { id: '1', name: 'User A' },
  { id: '2', name: 'User B' },
  { id: '3', name: 'User C' },
  { id: '4', name: 'User D' },
  { id: '4', name: 'User E' },
  { id: '4', name: 'User F' },
  { id: '4', name: 'User G' }
];

export default function Index() {
  const router = useRouter();

  // Blocked 유저 항목 렌더
  const renderBlockedUser = ({ item }) => (
    <View style={styles.Card}>
      <Text style={styles.blockedUserName}>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={blockedUsers}
      keyExtractor={(item) => item.id}
      renderItem={renderBlockedUser}
      ListHeaderComponent={
        <>
          {/* 프로필 카드 */}
          <View style={styles.profileCard}>
            <View style={styles.rowContainer}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>John Doe</Text>
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

          {/* 콜 요약 */}
          <Text style={styles.title}>Latest Call summary</Text>
          <View style={styles.Latest_Call_summary}>
            <Text>전화번호 예시</Text>
            <Text>AI Summary</Text>
            <Text>연락을 원하는 상대방과의 대화</Text>
          </View>

          {/* Blocked 리스트 제목 */}
          <Text style={styles.title}>Blocked List</Text>
        </>
      }
      contentContainerStyle={[styles.container, { paddingBottom: 30 }]}
    />
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
    height: 185,
    backgroundColor: '#FFFFFF',
    borderColor: '#A3B5C9',
    borderRadius: 12,
    padding: 0,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 7, height: 7 },
    shadowRadius: 30,
    elevation: 4,
    marginTop: 10,
  },
  Card: {
    width: 350,
    minHeight: 80,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#A3B5C9',
    padding: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 7, height: 7 },
    shadowRadius: 30,
    elevation: 3,
    marginVertical: 5,
  },
  Latest_Call_summary: {
    width:350,
    backgroundColor: '#F2F2F2',
    borderColor: '#A3B5C9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 1,
    marginTop: 5,
  },
  settingsButton: {
    paddingLeft: '26%',
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  settingsImage: {
    width: 35,
    height: 35,
    margin: 0,
    backgroundColor: '#FFFFFF',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  profileImage: {
    width: 65,
    height: 65,
    margin: 15,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    marginLeft: 20,
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginLeft: 10,
    color: '#222',
    marginTop: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  statBox: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft:25
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#F2F2F2',
    borderColor: '#A3B5C9',
    borderRadius: 12,
    elevation: 3,
    paddingVertical: 8,
    paddingHorizontal: 14,
    textAlign: 'center',
    width: 75,
    height: 45,
    margin:5
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B22222',
    marginTop: 8,
  },
  blockedUserName: {
    fontSize: 18,
    color: '#B22222',
    marginTop: 8,
  },
});
