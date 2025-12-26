// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Регистрация с email и паролем
  async function signup(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Обновляем профиль с именем пользователя
      await updateProfile(userCredential.user, {
        displayName: username
      });

      // Создаем запись пользователя в Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        username: username,
        createdAt: new Date().toISOString(),
        stats: {
          watched: 0,
          planned: 0,
          dropped: 0,
          friends: 0,
          rating: 50
        },
        bio: 'Новый пользователь аниме-платформы',
        favorites: [],
        watching: [],
        posts: []
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Вход с email и паролем
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Вход через Google
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Проверяем, существует ли пользователь в базе
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Создаем нового пользователя в Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          username: result.user.displayName || result.user.email.split('@')[0],
          createdAt: new Date().toISOString(),
          stats: {
            watched: 0,
            planned: 0,
            dropped: 0,
            friends: 0,
            rating: 50
          },
          bio: 'Пользователь аниме-платформы',
          photoURL: result.user.photoURL,
          favorites: [],
          watching: [],
          posts: []
        });
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Выход
  function logout() {
    return signOut(auth);
  }

  // Сброс пароля
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Обновление профиля
  async function updateUserProfile(userId, data) {
    await setDoc(doc(db, 'users', userId), data, { merge: true });
  }

  // Получение данных пользователя
  async function fetchUserData(userId) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Загружаем данные пользователя из Firestore
        const data = await fetchUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
    fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}