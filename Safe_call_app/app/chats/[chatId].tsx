import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { checkForScam } from '../../utils/gptScamCheck'; // Adjust path if needed

export default function ChatRoom() {
  const { chatId, name } = useLocalSearchParams(); // Assuming name comes from the route params
  const [messages, setMessages] = useState([
    { id: '1', from: 'them', text: 'Congratulations! You won an iPhone!' },
    { id: '2', from: 'me', text: 'Really? How do I get it?' },
  ]);
  const [input, setInput] = useState('');

  // Scam detection on latest incoming message
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.from === 'them') {
      (async () => {
        const result = await checkForScam(lastMsg.text);
        if (result?.toLowerCase().includes('scam')) {
          Alert.alert('⚠️ Scam Warning', 'GPT suspects this message may be a scam.');
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              from: 'system',
              text: '⚠️ Warning: This message might be a scam. Be cautious.',
            },
          ]);
        }
      })();
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: 'me', text: input.trim() },
    ]);
    setInput('');
  };

  const renderItem = ({ item }) => {
    const alignment =
      item.from === 'me'
        ? 'items-end'
        : item.from === 'system'
        ? 'items-center'
        : 'items-start';
    const bgColor =
      item.from === 'me'
        ? 'bg-light-100'
        : item.from === 'system'
        ? 'bg-yellow-200'
        : 'bg-gray-200';

    return (
      <View className={`my-1 ${alignment}`}>
        <Text className={`px-4 py-2 rounded-xl ${bgColor} text-black max-w-[80%]`}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Custom Header */}
      <View className="p-4 bg-gray-800">
        <Text className="text-white text-2xl font-semibold">{name || 'Chat'}</Text>
      </View>

      {/* Chat messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Message input */}
      <View className="flex-row items-center mt-4">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="bg-primary px-4 py-2 rounded-full"
        >
          <Text className="text-white">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

ChatRoom.options = {
  headerShown: false, // This hides the default header
};
