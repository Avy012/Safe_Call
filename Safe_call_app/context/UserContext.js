import React, { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await firebaseUser.reload();
          const refreshedUser = auth.currentUser;

          const docRef = doc(db, 'users', refreshedUser.uid);
          const docSnap = await getDoc(docRef);

          const firestoreData = docSnap.exists() ? docSnap.data() : {};

          console.log('✅ Loaded Firestore + Firebase user:', {
            uid: refreshedUser.uid,
            name: firestoreData.name,
            phone: firestoreData.phone,
            profilePic: firestoreData.profilePic,
          });

          setUser({
            uid: refreshedUser.uid,
            name: refreshedUser.displayName || firestoreData.name || '익명',
            phone: firestoreData.phone || '알 수 없음',
            imageUri: refreshedUser.photoURL || firestoreData.profilePic || '',
          });
        } catch (err) {
          console.error('🔥 Error loading user:', err);
          setUser(null);
        }
      } else {
        console.log('👋 No user is logged in');
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};
