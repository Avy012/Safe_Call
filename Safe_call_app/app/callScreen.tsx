import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CallScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black justify-center items-center">
      {/* Caller Name */}
      <Text className="text-white text-3xl font-bold mb-4">Calling Alice...</Text>
      <Text className="text-white text-sm mb-20">00:12</Text>

      {/* Action Buttons Row */}
      <View className="flex-row justify-around w-full px-16 mb-16">
        <TouchableOpacity className="items-center" onPress={() => alert('Muted')}>
          <View className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center mb-2" />
          <Text className="text-white text-sm">Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => alert('Speaker On')}>
          <View className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center mb-2" />
          <Text className="text-white text-sm">Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => alert('Video')}>
          <View className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center mb-2" />
          <Text className="text-white text-sm">Video</Text>
        </TouchableOpacity>
      </View>

      {/* End Call Button */}
      <TouchableOpacity
        className="bg-red-600 w-16 h-16 rounded-full justify-center items-center"
        onPress={() => router.back()}
      >
        <Text className="text-white font-bold">End</Text>
      </TouchableOpacity>
    </View>
  );
}
