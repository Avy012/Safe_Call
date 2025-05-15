import * as React from 'react';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  findNodeHandle,
  NativeModules,
} from 'react-native';
import type { RootStackParamList } from './app';
import { useEffect, useState } from 'react';
import { RoomControls } from './roomControls';
import { ParticipantView } from './participantView';
import {
  AudioSession,
  useIOSAudioManagement,
  useLocalParticipant,
  LiveKitRoom,
  useDataChannel,
  useRoomContext,
  useVisualStableUpdate,
  useTracks,
  TrackReferenceOrPlaceholder,
  ReceivedDataMessage,
} from '@livekit/react-native';
import { Platform } from 'react-native';
// @ts-ignore
import {
  mediaDevices,
  ScreenCapturePickerView,
} from '@livekit/react-native-webrtc';
import { startCallService, stopCallService } from './callservice/callService';
import Toast from 'react-native-toast-message';

import 'fastestsmallesttextencoderdecoder';
import { Track } from 'livekit-client';

// RoomPage 컴포넌트, 네비게이션 통해 URL과 토큰 받아서 방에 연결
export const RoomPage = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'RoomPage'>) => {
  const { url, token } = route.params;

  useEffect(() => {
    
    // 컴포넌트가 마운트될 때 오디오 세션 시작
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      // 컴포넌트가 인마운트될 때 오디오 세션 중지
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    // LiveKitRoom 컴포넌트를 통해 실제 회의 방에 연결
    <LiveKitRoom
      serverUrl={url}
      token={token}
      connect={true}
      options={{
        adaptiveStream: { pixelDensity: 'screen' },
      }}
      audio={true}
      video={true}
    >
      <RoomView navigation={navigation} />
    </LiveKitRoom>
  );
};

// RoomView 컴포넌트, 실제 회의 UI 및 기능 담당
interface RoomViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RoomPage'>;
}

const RoomView = ({ navigation }: RoomViewProps) => {
  const [isCameraFrontFacing, setCameraFrontFacing] = useState(true); // 카메라 방향 상태 관리
  const room = useRoomContext(); // 현재 방에 대한 컨텍스트 
  useIOSAudioManagement(room); // iOS에서 오디오 관리
  // Perform platform specific call setup.
  // iOS에서 호출 서비스 시작 및 종료료
  useEffect(() => {
    startCallService(); // 전화 서비스 시작
    return () => {
      stopCallService(); // 컴포넌트 언마운트될 때 전화 서비스 종료
    };
  }, []);

  // Setup room listeners
  // 데이터 채널을 통해 메시지 수신 시 처리하는 함수
  const { send } = useDataChannel(
    (dataMessage: ReceivedDataMessage<string>) => {
      //@ts-ignore
      let decoder = new TextDecoder('utf-8');
      let message = decoder.decode(dataMessage.payload); // 수신된 데이터 디코딩

      let title = 'Received Message';
      if (dataMessage.from != null) {
        title = 'Received Message from ' + dataMessage.from?.identity; // 메시지 보낸 사람 표시
      }
      // 수신된 메시지 토스트로 표시
      Toast.show({
        type: 'success',
        text1: title,
        text2: message,
      });
    }
  );

  // 카메라 및 화면 공유 트랙 관리
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true }, // 카메라 트랙
      { source: Track.Source.ScreenShare, withPlaceholder: false }, // 화면 공유 트랙
    ],
    { onlySubscribed: false }
  );
  const stableTracks = useVisualStableUpdate(tracks, 5); // 안정적인 트랙 업데이트
  // Setup views.

  // 첫 번째 트랙 (주로 자신 비디오) 표시
  const stageView = tracks.length > 0 && (
    <ParticipantView trackRef={stableTracks[0]} style={styles.stage} />
  );


  // 다른 참가자들의 비디오 트랙 수평으로 나열 (FlatList 사용)
  const renderParticipant: ListRenderItem<TrackReferenceOrPlaceholder> = ({
    item,
  }) => {
    return (
      <ParticipantView trackRef={item} style={styles.otherParticipantView} />
    );
  };

  const otherParticipantsView = stableTracks.length > 0 && (
    <FlatList
      data={stableTracks}
      renderItem={renderParticipant} // 다른 참가자들 렌더링
      horizontal={true} // 수평 나열
      style={styles.otherParticipantsList}
    />
  );


  // 로컬 참가자 상태 (마이크, 카메라, 화면 공유)
  const {
    isCameraEnabled,
    isMicrophoneEnabled,
    isScreenShareEnabled,
    localParticipant,
  } = useLocalParticipant();

  // Prepare for iOS screenshare.
  // iOS에서 화면 공유 선택하는 UI 구성
  const screenCaptureRef = React.useRef(null);
  const screenCapturePickerView = Platform.OS === 'ios' && (
    <ScreenCapturePickerView ref={screenCaptureRef} />
  );

  // 화면 공유 시작 함수
  const startBroadcast = async () => {
    if (Platform.OS === 'ios') {
      const reactTag = findNodeHandle(screenCaptureRef.current);
      await NativeModules.ScreenCapturePickerViewManager.show(reactTag);
      localParticipant.setScreenShareEnabled(true);
    } 
    // 안드로이드
    else {
      localParticipant.setScreenShareEnabled(true); // 안드로이드에서는 바로 화면 공유 활성화화
    }
  };

  return (
    <View style={styles.container}>
      {stageView} {/* 첫 번쨰 참가자 비디오 (자기 화면) */}
      {otherParticipantsView} {/* 다른 참가자들 비디오 */}

      {/* RoomControls 컴포넌트로 회의 제어 */}
      <RoomControls
        micEnabled={isMicrophoneEnabled} // 마이크 상태 전달
        setMicEnabled={(enabled: boolean) => {
          localParticipant.setMicrophoneEnabled(enabled); // 마이크 상태 변경
        }}
        cameraEnabled={isCameraEnabled} // 카메라 상태 전달
        setCameraEnabled={(enabled: boolean) => {
          localParticipant.setCameraEnabled(enabled); // 카메라 상태 변경
        }}
        switchCamera={async () => {
          // 카메라 전환 (앞/후면 카메라 전환)
          let facingModeStr = !isCameraFrontFacing ? 'front' : 'environment';
          setCameraFrontFacing(!isCameraFrontFacing);

          let devices = await mediaDevices.enumerateDevices(); // 사용 가능한 비디오 장치 확인
          var newDevice;
          //@ts-ignore
          for (const device of devices) {
            //@ts-ignore
            if (
              device.kind === 'videoinput' &&
              device.facing === facingModeStr
            ) {
              newDevice = device; // 새로운 카메라 장치 찾기
              break;
            }
          }

          if (newDevice == null) {
            return; // 새로운 카메라 장치 없으면 종료
          }

          //@ts-ignore
          await room.switchActiveDevice('videoinput', newDevice.deviceId); // 장치 변경
        }}
        screenShareEnabled={isScreenShareEnabled} // 화면 공유 상태 전달
        setScreenShareEnabled={(enabled: boolean) => {
          if (enabled) {
            startBroadcast(); // 화면 공유 시작
          } else {
            localParticipant.setScreenShareEnabled(enabled); // 화면 공유 종료
          }
        }}
        sendData={(message: string) => {
          Toast.show({
            type: 'success',
            text1: 'Sending Message',
            text2: message,
          });

          //@ts-ignore
          let encoder = new TextEncoder();
          let encodedData = encoder.encode(message); // 메시지 인코딩
          send(encodedData, { reliable: true }); // 메시지 전송
        }}
        onSimulate={(scenario) => {
          room.simulateScenario(scenario); // 시나리오 시뮬레이션
        }}
        onDisconnectClick={() => {
          navigation.pop(); // 회의 종료 및 이전 화면으로 이동
        }}
      />
      {screenCapturePickerView} {/* iOS 화면 공유 선택 뷰 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    flex: 1,
    width: '100%',
  },
  otherParticipantsList: {
    width: '100%',
    height: 150,
    flexGrow: 0,
  },
  otherParticipantView: {
    width: 150,
    height: 150,
  },
});
