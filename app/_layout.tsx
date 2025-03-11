import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
        name ="(tabs)"
        options = {{ headerShown: false }}
    />

    {/*스택 하나라 오류 뜨는듯..?*/}

  </Stack>;
}
