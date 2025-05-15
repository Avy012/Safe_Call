import * as React from 'react';

import { DarkTheme, NavigationContainer } from '@react-navigation/native'; // 네비게이션 컨테이너 및 다크 테마 임포트
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // 네이티브 스택 네비게이터 임포트
import { PreJoinPage } from './preJoinPage'; // 참가 전 화면 컴포넌트 임포트
import { RoomPage } from './roomPage'; // 회의 방 화면 컴포넌트 임포트
import Toast from 'react-native-toast-message'; // 토스트 메시지 컴포넌트 임포트

const Stack = createNativeStackNavigator(); // 스택 네비게이터 생성
export default function App() {
  return (
    <>
    {/* NavigationContainer는 네비게이션을 위한 컨테이너, DarkTheme 사용 */}
      <NavigationContainer theme={DarkTheme}>

        {/* Stack.Naviagator를 사용해 화면 전환을 위한 스택 네비게이터 설정 */}
        <Stack.Navigator>

          {/* PreJoinPage는 회의 참가 전 보여지는 화면 */}
          <Stack.Screen name="PreJoinPage" component={PreJoinPage} />

          {/* RoomPage는 실제 회의 진행 화면 */}
          <Stack.Screen name="RoomPage" component={RoomPage} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Toast는 메시지를 화면에 띄울 때 사용하는 컴포넌트 */}
      <Toast />
    </>
  );
}


// 네비게이션에서 사용되는 화면 파라미터 리스트 정릐
export type RootStackParamList = {
  PreJoinPage: undefined; // PreJoinPage는 파라미터 없는 화면
  RoomPage: { url: string; token: string }; // RoomPage는 URL과 토큰을 파라미터로 받는 화면
};
