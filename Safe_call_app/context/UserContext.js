import React, { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 🔁 Reload to get latest profile info
          await firebaseUser.reload();
          const refreshedUser = auth.currentUser;

          console.log('✅ Refreshed user from Firebase Auth:', {
            uid: refreshedUser?.uid,
            name: refreshedUser?.displayName,
            photoURL: refreshedUser?.photoURL,
          });

          setUser({
            uid: refreshedUser.uid,
            name: refreshedUser.displayName || '익명',
            phone: refreshedUser.phoneNumber || '알 수 없음',
            imageUri:
              refreshedUser.photoURL ||
              '', // Optional fallback image URL here
          });
        } catch (err) {
          console.error('🔥 Error reloading user:', err);
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
