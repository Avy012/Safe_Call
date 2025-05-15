import * as React from 'react';
import { useState, useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StyleSheet, View, TextInput, Text, Button } from 'react-native';
import type { RootStackParamList } from './app'; // RootStackParamList 타입으로 임포트
import { useTheme } from '@react-navigation/native'; // 현재 테마 가져오는 훅
import AsyncStorage from '@react-native-async-storage/async-storage'; // 비동기 저장소 사용을 위한 패키지

const DEFAULT_URL = 'wss://www.example.com'; // 기본 URL
const DEFAULT_TOKEN = ''; // 기본 토큰

const URL_KEY = 'url'; // AsyncStorage에 저장될 URL 키
const TOKEN_KEY = 'token'; // AsyncStorage에 저장될 토큰 키

// NativeSatckScreenProps를 사용해 PreJoinPage 화면에서의 네이게이션 처리
export const PreJoinPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'PreJoinPage'>) => {
  
  // URL과 토큰 상태 초기화
  const [url, setUrl] = useState(DEFAULT_URL);
  const [token, setToken] = useState(DEFAULT_TOKEN);

  // 컴포넌트가 마운트 될 때 AsyncStorage에서 값을 불러오는 effect
  useEffect(() => {
    // AsyncStorage에서 URL 값 불러와서 상태 반영
    AsyncStorage.getItem(URL_KEY).then((value) => {
      if (value) {
        setUrl(value); // 값이 있으면 url 상태 업데이트
      }
    });

    // AsyncStorage에서 토큰 값 불러와서 상태 반영
    AsyncStorage.getItem(TOKEN_KEY).then((value) => {
      if (value) {
        setToken(value); // 값이 있으면 토큰 상태 업데이트
      }
    });
  }, []);

  // 현재 테마 색상 값 가져오기
  const { colors } = useTheme();

  // URL과 토큰 값 AsyncStorage에 저장하는 함수
  let saveValues = (saveUrl: string, saveToken: string) => {
    AsyncStorage.setItem(URL_KEY, saveUrl); // URL을 AsyncStorage에 저장
    AsyncStorage.setItem(TOKEN_KEY, saveToken); // 토큰을 AsyncStorage에 저장
  };
  return (
    <View style={styles.container}>
      {/* URL 입력 필드 */}
      <Text style={{ color: colors.text }}>URL</Text>
      <TextInput
        style={{
          color: colors.text, // 텍스트 색상
          borderColor: colors.border, // 테두리 색상
          ...styles.input, // 기존 input 스타일 적용
        }}
        onChangeText={setUrl} // URL 텍스트 변경 시마다 상태 업데이트
        value={url} // 현재 URL 상태 값 표시
      />

      {/* 토큰 입력 필드 */}
      <Text style={{ color: colors.text }}>Token</Text>
      <TextInput
        style={{
          color: colors.text, // 텍스트 색상
          borderColor: colors.border, // 테두리 색상
          ...styles.input, // 기존 input 스타일 적용
        }}
        onChangeText={setToken} // 토큰 텍스트 변경 시마다 상태 업데이트
        value={token} // 현재 토큰 상태 값 표시
      />

        {/* Connect 버튼 - RoomPage로 네비게이션 */}
      <Button
        title="Connect"
        onPress={() => {
          navigation.push('RoomPage', { url: url, token: token }); // RoomPage로 이동하며 URL과 토큰 전달
        }}
      />

      <View style={styles.spacer} /> {/* 공간을 위한 뷰 */}

      {/* Save Values 버튼 - URL과 토큰 값 저장 */}
      <Button
        title="Save Values"
        onPress={() => {
          saveValues(url, token); // AsyncStorage에 URL과 토큰 저장
        }}
      />

      <View style={styles.spacer} /> {/* 공간을 위한 뷰 */}

      {/* Reset Values 버튼 - 기본 URL과 토큰으로 리셋 */}
      <Button
        title="Reset Values"
        onPress={() => {
          saveValues(DEFAULT_URL, DEFAULT_TOKEN); // 기본값으로 저장
          setUrl(DEFAULT_URL); // URL 상태 리셋
          setToken(DEFAULT_TOKEN); // 토큰 상태 리셋
        }}
      />
    </View>
  );
};


// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  spacer: {
    height: 10, // 버튼들 간 간격 위한 스타일
  },
});
