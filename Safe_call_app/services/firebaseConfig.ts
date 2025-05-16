// // firebaseConfig.ts
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyAWDTc1_GZwcNWH6NTKMDNA3Hzus4RnfNg",
//   authDomain: "safe-call-f0276.firebaseapp.com",
//   databaseURL: "https://safe-call-f0276-default-rtdb.firebaseio.com",
//   projectId: "safe-call-f0276",
//   storageBucket: "safe-call-f0276.firebasestorage.app",
//   messagingSenderId: "1086704094001",
//   appId: "1:1086704094001:web:fa98e2710ea0d0d90efe10",
//   measurementId: "G-Y95MX31BX3"
// }

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const analytics = getAnalytics(app);

// export { auth, db };

// firebaseConfig.ts

//Firebase가 초기화된 후 auth와 db를 정상적으로 사용할 수 있도록

import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAWDTc1_GZwcNWH6NTKMDNA3Hzus4RnfNg",
  authDomain: "safe-call-f0276.firebaseapp.com",
  databaseURL: "https://safe-call-f0276-default-rtdb.firebaseio.com",
  projectId: "safe-call-f0276",
  storageBucket: "safe-call-f0276.firebasestorage.app",
  messagingSenderId: "1086704094001",
  appId: "1:1086704094001:web:fa98e2710ea0d0d90efe10",
  measurementId: "G-Y95MX31BX3"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 인증, Firestore, Analytics 모듈 가져오기
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Firebase 앱 초기화가 완료된 후 사용하도록 설정
const initializeFirebase = async () => {
  try {
    // Firebase가 초기화되었는지 확인
    if (!app.options.apiKey) {
      throw new Error("Firebase has not been initialized");
    }
    console.log("Firebase Initialized");

    return { auth, db, analytics };
  } catch (error) {
    console.error("Firebase initialization error: ", error);
    throw error;
  }
};

export { auth, db, initializeFirebase, analytics };
