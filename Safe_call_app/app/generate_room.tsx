// // // 생성된 룸 입장하는 코드 
// // // 토큰 생성한거 가져오는 코드 추가해야 함 

// // import React, { useEffect } from 'react';
// // import {
// //   StyleSheet,
// //   View,
// //   FlatList,
// //   ListRenderItem
// // } from 'react-native';
// // import {
// //   AudioSession,
// //   LiveKitRoom,
// //   useTracks,
// //   TrackReferenceOrPlaceholder,
// //   VideoTrack,
// //   isTrackReference,
// //   registerGlobals,
// //   useParticipants,
// //   useRoomContext,
// // } from '@livekit/react-native';
// // import { Track, Room, RemoteParticipant, TrackPublication, RoomEvent, Participant, RemoteTrackPublication, RemoteTrack } from 'livekit-client';
// // import { handleAudioStream } from './livekitIntegration';

// // // Setup LiveKit WebRTC support
// // registerGlobals();

// // // Replace with your actual values   생성된 토큰 여기에 넣는걸로 하면 될 듯 
// // const wsURL = "wss://safecall-ozn2xsg6.livekit.cloud";
// // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJpZGVudGl0eTY2IiwiaXNzIjoiQVBJV1JVenJCcktYRUY0IiwibmJmIjoxNzQ3NjE5MzA5LCJleHAiOjE3NDc2NDA5MDl9.c983G7js6Uq_0z9VR7Jkon8GuV-g6UvKdXWJsljaUD4";
// // const MY_IDENTITY = "identity66";

// // const LiveKitRoomScreen: React.FC = () => {
// //   useEffect(() => {
// //     const start = async () => {
// //       await AudioSession.startAudioSession();
// //     };

// //     start();
// //     return () => {
// //       AudioSession.stopAudioSession();
// //     };
// //   }, []);

// //   return (
// //     <LiveKitRoom
// //       serverUrl={wsURL}
// //       token={token}
// //       connect={true}
// //       audio={true}
// //       video={true}
// //       options={{
// //         adaptiveStream: { pixelDensity: 'screen' },
// //       }}
// //     >
// //       <RoomView />
// //     </LiveKitRoom>
// //   );
// // };

// // const RoomView: React.FC = () => {
// //   // const tracks = useTracks([Track.Source.Microphone, Track.Source.Camera]);
// //   const tracks = useTracks([Track.Source.Microphone, Track.Source.Camera]);
// //   // const participants = useParticipants();

// //   const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({ item }) => {
// //     if (isTrackReference(item)) {
// //       console.log('renderTrack if문 진입 ', item.trackSid);
// //       // handleAudioStream(item.track.mediaStream);
// //       return <VideoTrack trackRef={item} style={styles.participantView} />;
// //     } else {
// //       console.log('renderTrack else문 진입');
// //       return <View style={styles.participantView} />;
// //     }
// //   };

// // //   useEffect(() => {
// // //   // console.log("tracks 전체:", JSON.stringify(tracks, null, 2));
// // //   console.log('참가자 목록: ', participants);
// // //   participants.forEach((p) => {
// // //     console.log('참가자 아이덴티티: ', p.identity);
// // //     console.log('참가자 이름: ', p.name);
// // //   }, [participants]);

// // //   tracks.forEach((item) => {
// // //     if (
// // //       isTrackReference(item) &&
// // //       // 상대방 트랙만(내가 아닌) 골라서!
// // //       item.participant?.identity !== 'identity66' &&
// // //       item.kind === 'audio' &&
// // //       item.track?.mediaStream // mediaStream이 실제로 있는지 체크!
// // //     ) {
// // //       handleAudioStream(item.track.mediaStream);
// // //     }

// // //     if(item.participant?.identity !== MY_IDENTITY) {
// // //       console.log('다른 참가자 조인함 ', item.participant?.identity);
// // //       if(item.track?.mediaStream)
// // //         console.log('다른 참가자 미디어 스트림 있음');
// // //       else {console.log('다른 참가자 미디어 스트림 없음');}
// // //       if(item.kind === Track.Kind.Audio)
// // //         console.log('item.kind 값 오디오임')
// // //       else {console.log('item.kind 값 오디오 아님 ', item.track);}
// // //       if(item.track)
// // //         console.log('item.track 값 true');
// // //       else {console.log('item.track 값', item.track);}
// // //     }
// // //   });
// // // }, [tracks]);


// //   return (
// //     <View style={styles.container}>
// //       <FlatList<TrackReferenceOrPlaceholder>
// //         data={tracks}
// //         renderItem={renderTrack}
// //         keyExtractor={(_, index) => index.toString()}
// //       />
// //     </View>
// //   );
// // };

// // export default LiveKitRoomScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     alignItems: 'stretch',
// //     justifyContent: 'center',
// //   },
// //   participantView: {
// //     height: 300,
// //   },
// // });


// // import React, { useEffect, useState } from 'react';
// // import { StyleSheet, View, FlatList, ListRenderItem } from 'react-native';
// // import {
// //   LiveKitRoom,
// //   useRoomContext,
// //   useParticipants,
// //   VideoTrack,
// //   AudioSession,
// //   registerGlobals,
// //   TrackReferenceOrPlaceholder,
// // } from '@livekit/react-native';
// // import { RemoteParticipant, RemoteTrack, RemoteTrackPublication, RoomEvent, Track } from 'livekit-client';
// // import { handleAudioStream } from './livekitIntegration';

// // registerGlobals();

// // const WS_URL = 'wss://safecall-ozn2xsg6.livekit.cloud';
// // const TOKEN  = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJpZGVudGl0eTU1IiwiaXNzIjoiQVBJV1JVenJCcktYRUY0IiwibmJmIjoxNzQ3NjQ4MzUwLCJleHAiOjE3NDc2Njk5NTB9.k_3VNM0XewlhedboPkuKkaUhmAGUMZV6r2IMH5mLa3E';

// // export default function LiveKitRoomScreen() {
// //   // 오디오 세션 시작/종료
// //   useEffect(() => {
// //     console.log('[1] AudioSession.start');
// //     AudioSession.startAudioSession();
// //     return () => {
// //       console.log('[1] AudioSession.stop');
// //       AudioSession.stopAudioSession();
// //     };
// //   }, []);

// //   return (
// //     <LiveKitRoom
// //       serverUrl={WS_URL}
// //       token={TOKEN}
// //       connect={true}
// //       audio={true}   // 로컬 오디오 퍼블리시 및 원격 오디오 자동 재생
// //       video={false}   // 로컬 비디오 퍼블리시 및 원격 비디오 렌더링
// //       options={{ adaptiveStream: { pixelDensity: 'screen' } }}
// //       onConnected={() => console.log('[2] 방 연결 완료')}
// //       onDisconnected={() => console.log('[2] 방 연결 해제')}
// //       onError={e => console.warn('[2] 방 에러:', e)}
// //     >
// //       <RoomView />
// //     </LiveKitRoom>
// //   );
// // }


// // function RoomView() {
// //   // React Native SDK에서 제공하는 훅으로 participants 배열 가져오기
// //   const participants = useParticipants();
// //   // LiveKitRoom이 만든 context에서 Room 객체 가져오기
// //   const room = useRoomContext();
// //   // 구독이 완료된 TrackReference를 담을 상태
// //   const [subscribed, setSubscribed] = useState<TrackReferenceOrPlaceholder[]>([]);

// //   // ① 기존 publication 모두 수동으로 구독 요청
// //   useEffect(() => {;
// //     console.log('[3] 수동 구독 시작');
// //     participants.forEach(p =>
// //       p.trackPublications.forEach(pub => {
// //         console.log(`  • ${p.identity} 퍼블리케이션 ${pub.trackSid}, isSubscribed=${pub.isSubscribed}`);
// //         if (!pub.isSubscribed) {
// //           console.log(`    → pub.setSubscribed(true) 호출`);
// //           pub.setSubscribed(true);
// //         }
// //       })
// //     );
// //   }, [participants]);

// //   // ② TrackSubscribed 이벤트로 실제 구독된 트랙을 state에 추가
// //   useEffect(() => {
// //     const onTrackSubscribed = (trackRef: TrackReferenceOrPlaceholder) => {
// //       console.log('[4] TrackSubscribed 이벤트:', trackRef.trackSid, 'kind=', trackRef.track?.kind);
      
// //       try {
// //         if (trackRef.MediaStream) {
// //         // if (trackRef.track) {
// //           console.log('[4] audio 스트림 처리 핸들러 호출');
// //           handleAudioStream(trackRef.track.MediaStream);
// //         // }
// //         }
// //       } catch (e) {
// //         console.log('오디오 스트림 에러 ', e);
// //       }

// //       // if (trackRef.mediaStream) {
// //       //   // if (trackRef.track) {
// //       //     console.log('[4] audio 스트림 처리 핸들러 호출');
// //       //     handleAudioStream(trackRef.track.mediaStream);
// //       //   // }
// //       // }
      
// //       setSubscribed(curr => {
// //         if (curr.some(t => t.trackSid === trackRef.trackSid)) return curr;
// //         return [...curr, trackRef];
// //       });
// //     };
// //     console.log('[4] TrackSubscribed 리스너 등록');
// //     room.on(RoomEvent.TrackSubscribed, onTrackSubscribed,);
// //     return () => {
// //       console.log('[4] TrackSubscribed 리스너 해제');
// //       room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
// //     };
// //   }, [room]);

// //   console.log('[5] 현재 구독 트랙 수:', subscribed.length);

// //   // ③ 오디오 트랙만 골라서 렌더링
// //   const audioTracks = subscribed.filter(r => r.track?.kind === Track.Kind.Audio);

// //   const renderItem: ListRenderItem<TrackReferenceOrPlaceholder> = ({ item }) => {
// //     console.log('[6] 렌더링 비디오 트랙:', item.trackSid);
// //     return <VideoTrack trackRef={item} style={styles.video} />;
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={audioTracks}
// //         renderItem={renderItem}
// //         keyExtractor={item => item.trackSid}
// //         contentContainerStyle={styles.list}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
// //   list: { alignItems: 'center' },
// //   video: { width: '90%', height: 200, marginVertical: 8 },
// // });

// // import React, { useEffect, useState } from 'react';
// // import { StyleSheet, View, FlatList, ListRenderItem } from 'react-native';
// // import {
// //   LiveKitRoom,
// //   useRoomContext,
// //   useParticipants,
// //   VideoTrack,
// //   AudioSession,
// //   registerGlobals,
// // } from '@livekit/react-native';
// // import { RoomEvent, Track } from 'livekit-client';
// // import { handleAudioStream } from './livekitIntegration';

// // registerGlobals();

// // const WS_URL = 'wss://safecall-ozn2xsg6.livekit.cloud';
// // const TOKEN  = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXlSb29tIiwiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZX0sInN1YiI6ImlkZW50aXR5MTEiLCJpc3MiOiJBUElXUlV6ckJyS1hFRjQiLCJuYmYiOjE3NDc3MTQwODEsImV4cCI6MTc0NzczNTY4MX0.O0SDJ69f0cxjelV6kN2XtkhXJXKUCH-ZcMNbl6BEmJ4';

// // export default function LiveKitRoomScreen() {
// //   // 오디오 세션 시작/종료
// //   useEffect(() => {
// //     console.log('[1] AudioSession.start');
// //     AudioSession.startAudioSession();
// //     return () => {
// //       console.log('[1] AudioSession.stop');
// //       AudioSession.stopAudioSession();
// //     };
// //   }, []);

// //   return (
// //     <LiveKitRoom
// //       serverUrl={WS_URL}
// //       token={TOKEN}
// //       connect={true}
// //       audio={true}   // 로컬 오디오 퍼블리시 및 원격 오디오 자동 재생
// //       video={false}  // 로컬 비디오 퍼블리시 및 원격 비디오 렌더링
// //       options={{ adaptiveStream: { pixelDensity: 'screen' } }}
// //       onConnected={() => console.log('[2] 방 연결 완료')}
// //       onDisconnected={() => console.log('[2] 방 연결 해제')}
// //       onError={e => console.warn('[2] 방 에러:', e)}
// //     >
// //       <RoomView />
// //     </LiveKitRoom>
// //   );
// // }

// // function RoomView() {
// //   const participants = useParticipants();
// //   const room = useRoomContext();
// //   const [subscribed, setSubscribed] = useState<any[]>([]);

// //   // 기존 publication 모두 수동 구독 요청
// //   useEffect(() => {
// //     console.log('[3] 수동 구독 시작');
// //     participants.forEach(p =>
// //       p.trackPublications.forEach(pub => {
// //         console.log(`  • ${p.identity} 퍼블리케이션 ${pub.trackSid}, isSubscribed=${pub.isSubscribed}`);
// //         if (!pub.isSubscribed) {
// //           console.log(`    → pub.setSubscribed(true) 호출`);
// //           pub.setSubscribed(true);
// //         }
// //       })
// //     );
// //   }, [participants]);

// //   // TrackSubscribed 이벤트 핸들러 등록
// //   useEffect(() => {
// //     const onTrackSubscribed = (track, publication, participant) => {
// //       console.log('[4] TrackSubscribed 콜백');
// //       console.log('  [track]:', track);
// //       console.log('  [publication]:', publication);
// //       console.log('  [participant]:', participant);

// //       // 오디오 트랙 처리
// //       if (track && track.kind === 'audio') {
// //         console.log('오디오 트랙 처리 if문 통과');
// //         try {
// //           if (track.mediaStream) {
// //             console.log('[4] audio 스트림 처리 핸들러 호출');
// //             handleAudioStream(track.mediaStream);
// //           } else {
// //             console.warn('[4] mediaStreamTrack 없음!');
// //           }
// //         } catch (e) {
// //           console.log('[4] 오디오 스트림 에러 ', e);
// //         }
// //       }

// //       // 이미 구독된 트랙이면 패스
// //       setSubscribed(curr => {
// //         if (curr.some(t => t.sid === publication.trackSid)) return curr;
// //         return [...curr, { track, publication, participant, sid: publication.trackSid }];
// //       });
// //     };
// //     console.log('[4] TrackSubscribed 리스너 등록');
// //     room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
// //     return () => {
// //       console.log('[4] TrackSubscribed 리스너 해제');
// //       room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
// //     };
// //   }, [room]);

// //   console.log('[5] 현재 구독 트랙 수:', subscribed.length);

// //   // 오디오 트랙만 골라서 렌더링
// //   const audioTracks = subscribed.filter(r => r.track?.kind === Track.Kind.Audio);

// //   const renderItem: ListRenderItem<any> = ({ item }) => {
// //     console.log('[6] 렌더링 오디오 트랙:', item.sid);
// //     // 오디오 트랙은 화면에 렌더링 안 해도 되지만, 필요시 여기에 추가 UI 표시
// //     return <View style={styles.audioTrackBox}><></></View>;
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={audioTracks}
// //         renderItem={renderItem}
// //         keyExtractor={item => item.sid}
// //         contentContainerStyle={styles.list}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
// //   list: { alignItems: 'center' },
// //   audioTrackBox: { width: '90%', height: 40, marginVertical: 4, backgroundColor: '#222', borderRadius: 8 },
// // });


// // 기존존

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   FlatList,
//   ListRenderItem,
//   TouchableOpacity,
//   ImageBackground,
// } from 'react-native';
// import {
//   AudioSession,
//   LiveKitRoom,
//   useTracks,
//   TrackReferenceOrPlaceholder,
//   VideoTrack,
//   isTrackReference,
//   registerGlobals,
//   useLocalParticipant,
//   useParticipants,
//   useRoomContext,
// } from '@livekit/react-native';
// import { Participant, RoomEvent, Track } from 'livekit-client';
// import { useRouter } from 'expo-router';
// import { icons } from '@/constants/icons';
// import { handleAudioStream } from './livekitIntegration';

// // Setup LiveKit WebRTC support
// registerGlobals();

// const wsURL = "wss://safecall-ozn2xsg6.livekit.cloud";
// const token =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21SZWNvcmQiOnRydWUsInJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJtaiIsImlzcyI6IkFQSVdSVXpyQnJLWEVGNCIsIm5iZiI6MTc0Nzk3OTU1NiwiZXhwIjoxNzQ4MDAxMTU2fQ.pbvdu5_wIGpO3TYtYrVp-cLmRqgdr9Q7-XZJyFAF4DI";

// const LiveKitRoomScreen: React.FC = () => {
//   useEffect(() => {
//     const start = async () => {
//       await AudioSession.startAudioSession();
//     };

//     start();
//     return () => {
//       AudioSession.stopAudioSession();
//       console.log(token);
//     };
//   }, []);

//   return (
//     <LiveKitRoom
//       serverUrl={wsURL}
//       token={token}
//       connect={true}
//       options={{
//         adaptiveStream: { pixelDensity: 'screen' },
//       }}
//       audio={true}
//       video={true}
//     >
//       <RoomView />
//     </LiveKitRoom>
//   );
// };

// const RoomView: React.FC = () => {
//   const router = useRouter();
//   const { localParticipant } = useLocalParticipant();
//   const participants = useParticipants();
//   const room = useRoomContext();
//   const tracks = useTracks([Track.Source.Camera]);

//   const [isMuted, setIsMuted] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [subscribed, setSubscribed] = useState<any[]>([]);
//   const [startTime, setStartTime] = useState<number | null>(null);
//   const [endTime, setEndTime] = useState<number | null>(null);
//   const [callDuration, setCallDuration] = useState<number>(0);

//   // 수동 구독 요청
//   useEffect(() => {
//     console.log('[3] 수동 구독 시작');
//     participants.forEach((p) =>
//       p.trackPublications.forEach((pub) => {
//         console.log(
//           `  • ${p.identity} 퍼블리케이션 ${pub.trackSid}, isSubscribed=${pub.isSubscribed}`
//         );
//         if (!pub.isSubscribed) {
//           console.log(`    → pub.setSubscribed(true) 호출`);  
//           pub.setSubscribed(true);
//         }
//       })
//     );
//   }, [participants]);

//   // TrackSubscribed 이벤트 핸들러 등록
//   useEffect(() => {
//     const onTrackSubscribed = (track, publication, participant) => {
//       if (!startTime)
//         setStartTime(Date.now());

//       console.log('[4] TrackSubscribed 콜백');
//       console.log('  [track]:', track);
//       console.log('  [publication]:', publication);
//       console.log('  [participant]:', participant);

//       // 오디오 트랙 처리
//       if (track && track.kind === 'audio') {
//         console.log('오디오 트랙 처리 if문 통과');
//         try {
//           if (track.mediaStream) {
//             console.log('[4] audio 스트림 처리 핸들러 호출');
//             console.log('[4] media 스트림 트랙: ', track.mediaStream.getAudioTracks());
//             handleAudioStream(track.mediaStream);
//           } else {
//             console.warn('[4] mediaStreamTrack 없음!');
//           }
//         } catch (e) {
//           console.log('[4] 오디오 스트림 에러 ', e);
//         }
//       }

//       // 중복 구독 방지
//       setSubscribed((curr) => {
//         if (curr.some((t) => t.sid === publication.trackSid)) return curr;
//         return [...curr, { track, publication, participant, sid: publication.trackSid }];
//       });
//     };
    
//     const onTrackUnsubscribed = (track, publication, participant) => {
//       if (startTime && !endTime) {
//         console.log('[4-1] 트랙 구독 해제됨');
//         setEndTime(Date.now());
//         const duration = (Date.now() - startTime) / 1000;
//         setCallDuration(duration);
//         console.log('※ 통화 시간 : ', duration);
//       }
//     };

//     const onParticipantLeft = (Participant) => {
//       if (startTime && !endTime) {
//         console.log('[4-1] 참가자 퇴장');
//         setEndTime(Date.now());
//         const duration = (Date.now() - startTime) / 1000;
//         setCallDuration(duration);
//         console.log('※ 통화 시간 : ', duration);
//       }
//     }

//     console.log('[4] TrackSubscribed 리스너 등록');
//     room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
//     room.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
//     room.on(RoomEvent.ParticipantDisconnected, onParticipantLeft);

//     return () => {
//       console.log('[4] TrackSubscribed 리스너 해제');
//       room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
//       room.off(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
//       room.off(RoomEvent.ParticipantDisconnected, onParticipantLeft);
//     };
//   }, [room, startTime, endTime]);

//   // 음소거 토글
//   const toggleMute = async () => {
//     await localParticipant.setMicrophoneEnabled(isMuted);
//     setIsMuted(!isMuted);
//   };

//   // 비디오 토글
//   const toggleVideo = async () => {
//     await localParticipant.setCameraEnabled(!isVideoOn);
//     setIsVideoOn(!isVideoOn);
//   };

//   // 로컬 트랙 찾기
//   const localTrack = tracks.find(
//     (t) => isTrackReference(t) && t.participant.identity === localParticipant.identity
//   );

//   // 원격 트랙 찾기
//   const remoteTrack = tracks.find(
//     (t) =>
//       isTrackReference(t) &&
//       t.participant.identity !== localParticipant.identity &&
//       t.source === Track.Source.Camera
//   );

//   // 오디오 트랙만 필터링 (렌더링 필요 시)
//   const audioTracks = subscribed.filter((r) => r.track?.kind === Track.Kind.Audio);

//   const renderItem: ListRenderItem<any> = ({ item }) => {
//     console.log('[6] 렌더링 오디오 트랙:', item.sid);
//     // 오디오 트랙 UI 필요시 표시 가능
//     return <View style={styles.audioTrackBox} />;
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: 'black' }}>
//       {/* 원격 비디오 (전체 화면) */}
//       {remoteTrack && isTrackReference(remoteTrack) && isVideoOn && (
//         <VideoTrack trackRef={remoteTrack} style={{ flex: 1 }} />
//       )}

//       {/* 로컬 비디오 (작은 플로팅 윈도우) */}
//       {localTrack && isTrackReference(localTrack) && isVideoOn && (
//         <View
//           style={{
//             position: 'absolute',
//             top: 40,
//             right: 20,
//             width: 120,
//             height: 160,
//             borderRadius: 12,
//             overflow: 'hidden',
//           }}
//         >
//           <VideoTrack trackRef={localTrack} style={{ flex: 1 }} />
//         </View>
//       )}

//       {/* 비디오 토글 버튼 */}
//       <View
//         style={{
//           position: 'absolute',
//           bottom: 80,
//           left: 0,
//           right: 0,
//           alignItems: 'center',
//           flexDirection: 'row',
//           justifyContent: 'center',
//         }}
//       >
//         <ImageBackground
//           source={isVideoOn ? icons.video_on : icons.video_off}
//           style={{ width: 70, height: 70, marginHorizontal: 8, borderRadius: 14, overflow: 'hidden' }}
//         >
//           <TouchableOpacity onPress={toggleVideo} style={{ flex: 1 }} />
//         </ImageBackground>

//         {/* 음소거 버튼 */}
//         <ImageBackground
//           source={isMuted ? icons.mute_off : icons.mute_on}
//           style={{
//             width: 70,
//             height: 70,
//             marginHorizontal: 8,
//             borderRadius: 14,
//             overflow: 'hidden',
//           }}
//         >
//           <TouchableOpacity onPress={toggleMute} style={{ flex: 1 }} />
//         </ImageBackground>
//       </View>

//       {/* 통화 종료 버튼 */}
//       <View
//         style={{
//           position: 'absolute',
//           bottom: 40,
//           left: 0,
//           right: 0,
//           alignItems: 'center',
//         }}
//       >
//         <ImageBackground
//           source={icons.hangup}
//           style={{ width: 70, height: 70, marginHorizontal: 8, borderRadius: 14, overflow: 'hidden' }}
//         >
//           <TouchableOpacity onPress={() => router.back()} style={{ flex: 1 }} />
//         </ImageBackground>
//       </View>

//       {/* 오디오 트랙 리스트 (필요 시 UI 표시) */}
//       <View style={styles.audioTrackListContainer}>
//         <FlatList
//           data={audioTracks}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.sid}
//           contentContainerStyle={styles.list}
//         />
//       </View>
//     </View>
//   );
// };

// export default LiveKitRoomScreen;

// const styles = StyleSheet.create({
//   audioTrackBox: { width: '90%', height: 40, marginVertical: 4, backgroundColor: '#222', borderRadius: 8 },
//   audioTrackListContainer: {
//     position: 'absolute',
//     bottom: 150,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   list: {
//     // FlatList contentContainerStyle에 맞는 스타일 예시
//     paddingVertical: 8,
//     alignItems: 'center',
//   },
// });

// // generate_room.tsx
// // import React, { useEffect, useState, useRef } from 'react';
// // import {
// //   StyleSheet,
// //   View,
// //   FlatList,
// //   ListRenderItem,
// //   TouchableOpacity,
// //   ImageBackground,
// // } from 'react-native';
// // import {
// //   AudioSession,
// //   LiveKitRoom,
// //   useTracks,
// //   isTrackReference,
// //   registerGlobals,
// //   useLocalParticipant,
// //   useParticipants,
// //   useRoomContext,
// // } from '@livekit/react-native';
// // import { Track, RoomEvent } from 'livekit-client';
// // import { useRouter } from 'expo-router';
// // import { icons } from '@/constants/icons';
// // import { startEgress, stopEgress } from './livekitIntegration';

// // registerGlobals();

// // const wsURL = "wss://safecall-ozn2xsg6.livekit.cloud";
// // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21SZWNvcmQiOnRydWUsInJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJtaiIsImlzcyI6IkFQSVdSVXpyQnJLWEVGNCIsIm5iZiI6MTc0Nzk3OTU1NiwiZXhwIjoxNzQ4MDAxMTU2fQ.pbvdu5_wIGpO3TYtYrVp-cLmRqgdr9Q7-XZJyFAF4DI";

// // const LiveKitRoomScreen: React.FC = () => {
// //   useEffect(() => {
// //     AudioSession.startAudioSession();
// //     return () => {
// //       AudioSession.stopAudioSession();
// //     };
// //   }, []);

// //   return (
// //     <LiveKitRoom
// //       serverUrl={wsURL}
// //       token={token}
// //       connect={true}
// //       options={{
// //         adaptiveStream: { pixelDensity: 'screen' },
// //       }}
// //       audio={true}
// //       video={false}
// //     >
// //       <RoomView />
// //     </LiveKitRoom>
// //   );
// // };

// // const RoomView: React.FC = () => {
// //   const router = useRouter();
// //   const { localParticipant } = useLocalParticipant();
// //   const participants = useParticipants();
// //   const room = useRoomContext();
// //   const tracks = useTracks([Track.Source.Camera]);
// //   const [isMuted, setIsMuted] = useState(true);
// //   const [isVideoOn, setIsVideoOn] = useState(true);
// //   const [subscribed, setSubscribed] = useState<any[]>([]);

// //   const egressIntervalRef = useRef<any>(null);
// //   const egressIdRef = useRef<string | null>(null);

// //   const start10sEgressLoop = (roomName: string, identity: string) => {
// //   if (egressIntervalRef.current) return;
// //   egressIntervalRef.current = setInterval(async () => {
// //     const resp = await startEgress(roomName, identity);
// //     console.log('Egress start response:', resp);  // 여기 응답 로그 추가
// //     if (resp.egress_id) {
// //       egressIdRef.current = resp.egress_id;
// //       console.log('egressId set:', egressIdRef.current);
// //       setTimeout(async () => {
// //         if (egressIdRef.current) {
// //           console.log('Calling stopEgress for id:', egressIdRef.current);
// //           await stopEgress(egressIdRef.current);
// //           egressIdRef.current = null;
// //         } else {
// //           console.log('egressIdRef.current is null at timeout');
// //         }
// //       }, 10000);
// //     } else {
// //       console.warn('Egress start response missing egress_id:', resp);
// //     }
// //   }, 10000);
// // };


// //   const stop10sEgressLoop = () => {
// //     if (egressIntervalRef.current) {
// //       clearInterval(egressIntervalRef.current);
// //       egressIntervalRef.current = null;
// //     }
// //     if (egressIdRef.current) {
// //       stopEgress(egressIdRef.current);
// //       egressIdRef.current = null;
// //     }
// //   };

// //   useEffect(() => {
// //     const onTrackSubscribed = (track, publication, participant) => {
// //       if (participant.identity !== localParticipant.identity) {
// //         start10sEgressLoop('my-room', participant.identity);
// //       }
// //       setSubscribed((curr) => {
// //         if (curr.some((t) => t.sid === publication.trackSid)) return curr;
// //         return [...curr, { track, publication, participant, sid: publication.trackSid }];
// //       });
// //     };

// //     room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
// //     return () => {
// //       room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
// //       stop10sEgressLoop();
// //     };
// //   }, [room, localParticipant.identity]);

// //   const toggleMute = async () => {
// //     await localParticipant.setMicrophoneEnabled(isMuted);
// //     setIsMuted(!isMuted);
// //   };
// //   const toggleVideo = async () => {
// //     await localParticipant.setCameraEnabled(!isVideoOn);
// //     setIsVideoOn(!isVideoOn);
// //   };

// //   const localTrack = tracks.find(
// //     (t) => isTrackReference(t) && t.participant.identity === localParticipant.identity
// //   );
// //   const remoteTrack = tracks.find(
// //     (t) =>
// //       isTrackReference(t) &&
// //       t.participant.identity !== localParticipant.identity &&
// //       t.source === Track.Source.Camera
// //   );

// //   const renderItem: ListRenderItem<any> = ({ item }) => (
// //     <View style={styles.audioTrackBox} />
// //   );

// //   return (
// //     <View style={{ flex: 1, backgroundColor: 'black' }}>
// //       {remoteTrack && isTrackReference(remoteTrack) && isVideoOn && (
// //         <View style={{ flex: 1 }}>
// //           {/* 원격 비디오 */}
// //         </View>
// //       )}
// //       {localTrack && isTrackReference(localTrack) && isVideoOn && (
// //         <View style={{
// //           position: 'absolute', top: 40, right: 20,
// //           width: 120, height: 160, borderRadius: 12, overflow: 'hidden'
// //         }}>
// //           {/* 로컬 비디오 */}
// //         </View>
// //       )}

// //       <View style={{
// //         position: 'absolute', bottom: 80, left: 0, right: 0,
// //         alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
// //       }}>
// //         <ImageBackground
// //           source={isVideoOn ? icons.video_on : icons.video_off}
// //           style={{ width: 70, height: 70, marginHorizontal: 8, borderRadius: 14, overflow: 'hidden' }}>
// //           <TouchableOpacity onPress={toggleVideo} style={{ flex: 1 }} />
// //         </ImageBackground>
// //         <ImageBackground
// //           source={isMuted ? icons.mute_off : icons.mute_on}
// //           style={{ width: 70, height: 70, marginHorizontal: 8, borderRadius: 14, overflow: 'hidden' }}>
// //           <TouchableOpacity onPress={toggleMute} style={{ flex: 1 }} />
// //         </ImageBackground>
// //       </View>

// //       <View style={{
// //         position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center',
// //       }}>
// //         <ImageBackground
// //           source={icons.hangup}
// //           style={{ width: 70, height: 70, marginHorizontal: 8, borderRadius: 14, overflow: 'hidden' }}>
// //           <TouchableOpacity onPress={() => {
// //             stop10sEgressLoop();
// //             router.back();
// //           }} style={{ flex: 1 }} />
// //         </ImageBackground>
// //       </View>

// //       <View style={styles.audioTrackListContainer}>
// //         <FlatList
// //           data={subscribed.filter((r) => r.track?.kind === Track.Kind.Audio)}
// //           renderItem={renderItem}
// //           keyExtractor={(item) => item.sid}
// //           contentContainerStyle={styles.list}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // export default LiveKitRoomScreen;

// // const styles = StyleSheet.create({
// //   audioTrackBox: { width: '90%', height: 40, marginVertical: 4, backgroundColor: '#222', borderRadius: 8 },
// //   audioTrackListContainer: {
// //     position: 'absolute', bottom: 150, left: 0, right: 0, alignItems: 'center',
// //   },
// //   list: { paddingVertical: 8, alignItems: 'center' },
// // });

// generate_room.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  VideoTrack,
  isTrackReference,
  registerGlobals,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
} from '@livekit/react-native';
import { Participant, RoomEvent, Track } from 'livekit-client';
import { useRouter } from 'expo-router';
import { icons } from '@/constants/icons';
import { handleLocalMicRecording, stopLocalMicRecording } from './livekitIntegration';

registerGlobals();

const wsURL = "wss://safecall-ozn2xsg6.livekit.cloud";
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21SZWNvcmQiOnRydWUsInJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWUsInJlY29yZGVyIjp0cnVlfSwic3ViIjoidGVzdGVyIiwiaXNzIjoiQVBJV1JVenJCcktYRUY0IiwibmJmIjoxNzQ4NDQ4MjQ1LCJleHAiOjE3NDg0Njk4NDV9.tbANcEXex6J8zF9gl_VAjBW63yUgMLdN-sOrSTuAl-A";
const roomName = "my-room";

const LiveKitRoomScreen: React.FC = () => {
  useEffect(() => {
    const start = async () => {
      await AudioSession.startAudioSession();
    };
    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={token}
      connect={true}
      options={{ adaptiveStream: { pixelDensity: 'screen' } }}
      audio={true}
      video={true}
    >
      <RoomView />
    </LiveKitRoom>
  );
};

const RoomView: React.FC = () => {
  const router = useRouter();
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const room = useRoomContext();
  const tracks = useTracks([Track.Source.Camera]);

  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [subscribed, setSubscribed] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);

  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  useEffect(() => { startTimeRef.current = startTime; }, [startTime]);
  useEffect(() => { endTimeRef.current = endTime; }, [endTime]);

  useEffect(() => {
    participants.forEach((p) =>
      p.trackPublications.forEach((pub) => {
        if (!pub.isSubscribed) {
          pub.setSubscribed(true);
          // pub.setVolume(0.5);
        }
      })
    );
  }, [participants]);

  useEffect(() => {
    if (!room) return;

    const onTrackSubscribed = (track, publication, participant) => {
      if (!startTimeRef.current) setStartTime(Date.now());

      if (track && track.kind === 'audio') {
        try {
          handleLocalMicRecording(roomName);
          // fullRecording(roomName);

        } catch (e) {
          console.log('오디오 스트림 에러', e);
        }
      }

      setSubscribed((curr) => {
        if (curr.some((t) => t.sid === publication.trackSid)) return curr;
        return [...curr, { track, publication, participant, sid: publication.trackSid }];
      });
    };

    const onTrackUnsubscribed = (participant) => {
      if (startTimeRef.current && !endTimeRef.current) {
        const now = Date.now();
        setEndTime(now);
        setCallDuration((now - (startTimeRef.current ?? now)) / 1000);
        console.log('통화 시간: ', callDuration);
      }

      console.log(`참가자 퇴장: ${participant.identity}`);
      stopLocalMicRecording();
    };

    const onParticipantLeft = (participant) => {
      if (startTimeRef.current && !endTimeRef.current) {
        const now = Date.now();
        setEndTime(now);
        setCallDuration((now - (startTimeRef.current ?? now)) / 1000);
        console.log('통화 시간: ', callDuration);
      }

      console.log(`참가자 퇴장: ${participant.identity}`);
      stopLocalMicRecording();
    };

    room?.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
    room?.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
    room?.on(RoomEvent.ParticipantDisconnected, onParticipantLeft);

    return () => {
      room?.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      room?.off(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
      room?.off(RoomEvent.ParticipantDisconnected, onParticipantLeft);
    };
  }, [room]);

  const toggleMute = async () => {
    await localParticipant.setMicrophoneEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  const toggleVideo = async () => {
    await localParticipant.setCameraEnabled(!isVideoOn);
    setIsVideoOn(!isVideoOn);
  };

  const localTrack = tracks.find(
    (t) => isTrackReference(t) && t.participant.identity === localParticipant.identity
  );

  const remoteTrack = tracks.find(
    (t) =>
      isTrackReference(t) &&
      t.participant.identity !== localParticipant.identity &&
      t.source === Track.Source.Camera
  );

  const audioTracks = subscribed.filter((r) => r.track?.kind === Track.Kind.Audio);

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return <View style={styles.audioTrackBox} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {remoteTrack && isTrackReference(remoteTrack) && isVideoOn && (
        <VideoTrack trackRef={remoteTrack} style={{ flex: 1 }} />
      )}

      {localTrack && isTrackReference(localTrack) && isVideoOn && (
        <View
          style={{
            position: 'absolute',
            top: 40,
            right: 20,
            width: 120,
            height: 160,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <VideoTrack trackRef={localTrack} style={{ flex: 1 }} />
        </View>
      )}

      <View
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <ImageBackground
          source={isVideoOn ? icons.video_on : icons.video_off}
          style={{ width: 70, height: 70, marginHorizontal: 8, borderRadius: 14, overflow: 'hidden' }}
        >
          <TouchableOpacity onPress={toggleVideo} style={{ flex: 1 }} />
        </ImageBackground>

        <ImageBackground
          source={isMuted ? icons.mute_off : icons.mute_on}
          style={{
            width: 70,
            height: 70,
            marginHorizontal: 8,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity onPress={toggleMute} style={{ flex: 1 }} />
        </ImageBackground>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <ImageBackground
          source={icons.hangup}
          style={{ width: 70, height: 70, marginHorizontal: 8, borderRadius: 14, overflow: 'hidden' }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ flex: 1 }} />
        </ImageBackground>
      </View>

      <View style={styles.audioTrackListContainer}>
        <FlatList
          data={audioTracks}
          renderItem={renderItem}
          keyExtractor={(item) => item.sid}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

export default LiveKitRoomScreen;

const styles = StyleSheet.create({
  audioTrackBox: { width: '90%', height: 40, marginVertical: 4, backgroundColor: '#222', borderRadius: 8 },
  audioTrackListContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  list: {
    paddingVertical: 8,
    alignItems: 'center',
  },
});
