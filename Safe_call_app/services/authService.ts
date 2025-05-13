import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../services/firebaseConfig'; // firebaseConfig에서 앱 설정 가져오기

// Firebase 앱 초기화
import { initializeApp } from 'firebase/app';
const app = initializeApp(firebaseConfig);

// Firebase 인증과 Firestore 초기화
const auth = getAuth(app);
const db = getFirestore(app);

// 회원가입 함수
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('회원가입 성공:', userCredential.user);
  } catch (error) {
    console.error('회원가입 실패:', error.message);
    throw error;
  }
};

// 로그인 함수
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('로그인 성공:', userCredential.user);
  } catch (error) {
    console.error('로그인 실패:', error.message);
    throw error;
  }
};

// 로그아웃 함수
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패:', error.message);
    throw error;
  }
};

// Firestore에 데이터 추가 함수
export const addUserToFirestore = async (userId: string, name: string) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      userId,
      name,
    });
    console.log('문서 추가 성공:', docRef.id);
  } catch (error) {
    console.error('문서 추가 실패:', error.message);
    throw error;
  }
};
