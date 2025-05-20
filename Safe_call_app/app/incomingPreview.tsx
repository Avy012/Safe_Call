import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function IncomingPreview() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Button
        title="📞 수신 화면 미리보기용 페이지지"
        onPress={() =>
          router.push({
            pathname: '/calls/incoming',
            params: {
              name: 'Emma Watson',
              phone: '010-1234-0005',
            },
          })
        }
      />
    </View>
  );
}
