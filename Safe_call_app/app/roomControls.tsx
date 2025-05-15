import * as React from 'react';
import { useState } from 'react';
import Dialog from 'react-native-dialog'; // 대화상자 컴포넌트

import {
  StyleSheet,
  View,
  Pressable,
  Image,
  ViewStyle,
  StyleProp,
  Modal, // 모달 컴포넌트
} from 'react-native';
// import { AudioOutputList } from './ui/AudioOutputList'; // 오디오 출력 리스트 컴포넌트

// 컴포넌트의 props 정의
export type Props = {
  micEnabled?: boolean; // 마이크 상태
  setMicEnabled: (enabled: boolean) => void; // 마이크 활성화/비활성화 설정 함수
  cameraEnabled?: boolean; // 카메라 상태
  setCameraEnabled: (enabled: boolean) => void; // 카메라 활성화/비활성화 설정 함수
  switchCamera: () => void; // 카메라 전환 함수
  screenShareEnabled: boolean; // 화면 공유 상태
  setScreenShareEnabled: (enabled: boolean) => void; // 화면 공유 활성화/비활성화 설정 함수
  sendData: (message: string) => void; // 메시지 전송 함수
  onDisconnectClick: () => void; // 연결 해제 함수
  style?: StyleProp<ViewStyle>; // 스타일 설정
};
export const RoomControls = ({
  micEnabled = false, // 기본값 false
  setMicEnabled,
  cameraEnabled = false, // 기본값 false
  setCameraEnabled,
  switchCamera,
  screenShareEnabled = false, // 기본값 false
  setScreenShareEnabled,
  sendData,
  onDisconnectClick,
  style,
}: Props) => {
  // 오디오 출력 모달의 가시성 상태 관리
  const [audioModalVisible, setAudioModalVisible] = useState(false);
  
  // 마이크, 카메라, 화면 공유에 따라 이미지 설정
  var micImage = micEnabled
    ? require('./icons/baseline_mic_white_24dp.png')
    : require('./icons/baseline_mic_off_white_24dp.png');

  var cameraImage = cameraEnabled
    ? require('./icons/baseline_videocam_white_24dp.png')
    : require('./icons/baseline_videocam_off_white_24dp.png');

  var screenShareImage = screenShareEnabled
    ? require('./icons/baseline_cast_connected_white_24dp.png')
    : require('./icons/baseline_cast_white_24dp.png');

  // 메시지 상태 관리
  let [message, setMessage] = useState('');
  let [messageDialogVisible, setMessageDialogVisible] = useState(false);
  
  // 메시지 전송 함수
  const handleOk = () => {
    sendData(message); // 메시지 전송
    setMessageDialogVisible(false); // 대화상자 닫기
  };


  // 대화상자 취소 함수
  const handleCancel = () => {
    setMessageDialogVisible(false); // 대화상자 닫기기
  };

  return (
    <View style={[style, styles.container]}>
      {/* 오디오 출력 선택 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={audioModalVisible}
        onRequestClose={() => {
          setAudioModalVisible(!audioModalVisible); // 모달 닫기
        }}
      >
        {/* <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AudioOutputList
              onSelect={() => {
                return setAudioModalVisible(false); // 오디오 출력 리스트에서 선택 후 모달 닫기
              }}
            />
          </View>
        </View> */}
      </Modal>

      {/* 마이크 아이콘 클릭 시 마이크 상태 토글 */}
      <Pressable
        onPress={() => {
          setMicEnabled(!micEnabled); // 마이크 활성화/비활성화
        }}
      >
        <Image style={styles.icon} source={micImage} />
      </Pressable>

      {/* 카메라 아이콘 클릭 시 카메라 상태 토글 */}
      <Pressable
        onPress={() => {
          setCameraEnabled(!cameraEnabled); // 카메라 활성화/비활성화
        }}
      >
        <Image style={styles.icon} source={cameraImage} />
      </Pressable>

      {/* 카메라 전환 아이콘 클릭시 카메라 전환 */}
      <Pressable
        onPress={() => {
          switchCamera(); // 카메라 전환
        }}
      >
        <Image
          style={styles.icon}
          source={require('./icons/camera_flip_outline.png')}
        />
      </Pressable>

      {/* 화면 공유 아이콘 클릭 시 화면 공유 상태 토글 */}
      <Pressable
        onPress={() => {
          setScreenShareEnabled(!screenShareEnabled); // 화면 공유 활성화/비활성화
        }}
      >
        <Image style={styles.icon} source={screenShareImage} />
      </Pressable>

      {/* 메시지 전송 아이콘 클릭 시 메시지 대화상자 표시 */}
      <Pressable
        onPress={() => {
          setMessageDialogVisible(true); // 메시지 대화상자 표시
        }}
      >
        <Image
          style={styles.icon}
          source={require('./icons/message_outline.png')}
        />
      </Pressable>

      {/* 연결 해제 아이콘 클릭 시 연결 해제 */}
      <Pressable
        onPress={() => {
          onDisconnectClick(); // 연결 해제
        }}
      >
        <Image
          style={styles.icon}
          source={require('./icons/baseline_cancel_white_24dp.png')}
        />
      </Pressable>

      {/* 오디오 출력 아이콘 클릭 시 오디오 출력 모달 표시 */}
      <Pressable
        onPress={() => {
          setAudioModalVisible(true); // 오디오 출력 모달 표시
        }}
      >
        <Image style={styles.icon} source={require('./icons/speaker.png')} />
      </Pressable>

      {/* 메시지 대화상자 */}
      <Dialog.Container
        visible={messageDialogVisible}
        onBackdropPress={handleCancel} // 대화상자 바깥 클릭 시 취소
      >
        <Dialog.Title style={styles.dialogItemTextStyle}>
          Send Message
        </Dialog.Title>
        <Dialog.Input
          style={styles.dialogItemTextStyle}
          onChangeText={setMessage} // 메시지 입력 시 상태 업데이트
        />
        <Dialog.Button label="Cancel" onPress={handleCancel} /> {/* 취소 버튼 */}
        <Dialog.Button label="Ok" onPress={handleOk} /> {/* 확인 버튼 */}
      </Dialog.Container>
    </View>
  );
};


// 스타일 정의
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row', // 아이콘 가로 정렬
    alignItems: 'center', // 아이콘 세로 중앙 정렬
    justifyContent: 'space-evenly', // 아이콘 간격 동일하게
    marginVertical: 8,
  },
  icon: {
    width: 32,
    height: 32, // 아이콘 크기 설정
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  dialogItemTextStyle: {
    color: 'black',
    fontSize: 12,
  },
});
