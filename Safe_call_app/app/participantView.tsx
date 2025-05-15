import * as React from 'react';

import { Image, StyleSheet, ViewStyle } from 'react-native';
import {
  isTrackReference, // 트랙 참조 확인 함수
  TrackReferenceOrPlaceholder, // 트랙 참조나 플레이스홀더 타입
  useEnsureTrackRef, // 트랩 참조를 안전하게 보장하는 훅
  useIsMuted, // 비디오 음소거 여부 확인 훅
  useIsSpeaking, // 말하는 중인지 여부 확인 훅
  useParticipantInfo, // 참가자 정보 가져오는 훅
  VideoTrack, // 비디오 트랙 컴포넌트트
} from '@livekit/react-native';
import { View } from 'react-native';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
export type Props = {
  trackRef: TrackReferenceOrPlaceholder; // 참가자 트랙 참조
  style?: ViewStyle; // 스타일링 옵션
  zOrder?: number; // 트랙의 z-순서
  mirror?: boolean; // 미러링 여부
};
export const ParticipantView = ({
  style = {}, // 기본 스타일 빈 객체로 설정
  trackRef, // 트랙 참조
  zOrder, // z-순서
  mirror, // 미러링 여부부
}: Props) => {
  // 'trackRef'가 유효한 트랙 참조인지 확인
  const trackReference = useEnsureTrackRef(trackRef);

  // 참가자 정보 가져오기 
  const { identity, name } = useParticipantInfo({
    participant: trackReference.participant, // 참가자 정보
  });

  // 참가자 말 중인지 확인
  const isSpeaking = useIsSpeaking(trackRef.participant);

  // 비디오 음소거 상태 확인
  const isVideoMuted = useIsMuted(trackRef);

  // 테마 색상 가져오기
  const { colors } = useTheme();

  // 비디오 뷰 변수 초기화
  let videoView;

  // 트랙이 비디오 트랙 && 음소거 아닌 경우 → 비디오 트랙 표시
  if (isTrackReference(trackRef) && !isVideoMuted) {
    videoView = (
      <VideoTrack
        style={styles.videoView}
        trackRef={trackRef} // 트랙 참조
        zOrder={zOrder} // z-순서
        mirror={mirror} // 미러링 여부
      />
    );
  } else {
    // 비디오 음소거 상태일 때 음소거 아이콘 표시
    videoView = (
      <View style={styles.videoView}>
        <View style={styles.spacer} />
        <Image
          style={styles.icon}
          source={require('./icons/baseline_videocam_off_white_24dp.png')} // 음소거 아이콘 이미지
        />
        <View style={styles.spacer} />
      </View>
    );
  }

  // 참가자 이름 or ID 표시
  const displayName = name ? name : identity;
  return (
    <View style={[styles.container, style]}>
      {videoView} //비디오 or 음소거 아이콘 렌더링
      <View style={styles.identityBar}>
        <Text style={{ color: colors.text }}>{displayName}</Text> // 참가자 이름/ID 텍스트
      </View>
      {isSpeaking && <View style={styles.speakingIndicator} />} // 말 중이면 speakingIndicator 표시
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00153C', // 배경색
  },
  speakingIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    borderColor: '#007DFF', // 파란색 테두리
    borderWidth: 3, // 테두리 두께
  },
  spacer: {
    flex: 1, // 여백 설정
  },
  videoView: {
    width: '100%',
    height: '100%', // 비디오 뷰 크기
  },
  identityBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 2,
    backgroundColor: 'rgba(0,0,0,0.5)', // 투명도 있는 배경
  },
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'center', // 아이콘 중앙 배치
  },
});
