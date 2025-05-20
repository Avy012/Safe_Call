import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';

const chatData = [
  {
    id: 'alice_room', // use as LiveKit room name
    name: 'Alice Johnson',
    lastMessage: 'See you tomorrow!',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 'bob_room',
    name: 'Bob Smith',
    lastMessage: 'Got it, thanks!',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
];

export default function Chats() {
  const handlePress = async (chat) => {
    try {
      // 🔐 Get LiveKit token (this should eventually come from your backend)
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGtpbSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJpZGVudGl0eSIsImlzcyI6IkFQSXE2Q1Y1ZTM3N2hteiIsIm5iZiI6MTc0NzcxMDU4NSwiZXhwIjoxNzQ3NzMyMTg1fQ.9FjRVKI7v-sDRPJsAcN3eC95dtZbZfr8w2PW9-k2FFE"; // room name = chat.id

      // ✅ Go to ChatRoom
      router.push({
        pathname: `/chats/${chat.id}/ChatRoomWrapper`,
        params: {
          chatId: chat.id,
          token,
          name: chat.name,
        },
      });
    } catch (error) {
      Alert.alert('Token Error', 'Failed to get LiveKit token');
      console.error('Token error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Title */}
      <View className="bg-primary px-4 py-4">
        <Text className="text-white text-2xl font-bold">Chats</Text>
      </View>

      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            className="flex-row items-center px-4 py-3 border-b border-gray-200"
          >
            <Image source={{ uri: item.profilePic }} className="w-12 h-12 rounded-full mr-4" />
            <View>
              <Text className="text-base font-semibold">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// 🔧 TEMP DUMMY TOKEN GENERATOR (replace with real backend call)
async function getLiveKitToken(roomName: string): Promise<string> {
  // ⚠️ Replace this with real API call to your token server
  // For now, use a placeholder test token
  return 'YOUR_FAKE_LIVEKIT_TOKEN'; // replace with server-issued JWT
}
