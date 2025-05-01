import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

const chatData = [
  {
    id: '1',
    name: 'Alice Johnson',
    lastMessage: 'See you tomorrow!',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'Bob Smith',
    lastMessage: 'Got it, thanks!',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
];

export default function Chats() {
  const handlePress = (chat) => {
    router.push({ pathname: `/chats/${chat.id}`, params: { name: chat.name } });
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
