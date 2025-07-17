import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import auth from '../config/firebase.config'; // Corrected import path
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null); // New state for Firebase user
  const [loading, setLoading] = useState(true);

  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('onAuthStateChanged - currentUser:', currentUser);
      setFirebaseUser(currentUser); // Store Firebase user
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          const userInfo = {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || currentUser.email.split('@')[0] || 'User',
            photoURL: currentUser.photoURL || '',
          };
          const response = await axiosPublic.post('/users/upsertFirebaseUser', userInfo);
          console.log('onAuthStateChanged - backend upsert response:', response.data);
          const mergedUserData = {
            ...response.data,
            name: response.data.name || currentUser.displayName,
            photoURL: response.data.photoURL || currentUser.photoURL,
          };
          setUser(mergedUserData);
          localStorage.setItem('token', idToken); // Store the token in localStorage
          queryClient.invalidateQueries(['userProfile']);
        } catch (error) {
          console.error('Failed to upsert user data in backend:', error.response?.data || error.message);
          setUser(null); // Set user to null if backend upsert fails
          localStorage.removeItem('token'); // Remove token on error
        } finally {
          setLoading(false); // Always set loading to false after processing
        }
      } else {
        console.log('onAuthStateChanged - no current user.');
        setUser(null);
        localStorage.removeItem('token'); // Clear token on logout
        setLoading(false); // Set loading to false when no user
        queryClient.invalidateQueries(['userProfile']); // Invalidate userProfile query on logout
      }
    });

    return () => {
      unsubscribe();
    };
  }, [axiosPublic]);

  useEffect(() => {
    const requestInterceptor = axiosPublic.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const idToken = await currentUser.getIdToken(true);
          config.headers.Authorization = `Bearer ${idToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPublic.interceptors.request.eject(requestInterceptor);
    };
  }, [axiosPublic]);

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const register = async (userData) => {
    try {
      const firebaseAuth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      await userCredential.user.updateProfile({
        displayName: userData.name || userData.email.split('@')[0] || 'User',
        photoURL: userData.photoURL || '',
      });
      return userCredential;
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      queryClient.invalidateQueries(['userProfile']); // Invalidate userProfile query on login
      toast.success('Login successful!');
      return userCredential;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    signOut(auth); // Sign out from Firebase
    setUser(null);
    toast.error('Logged out successfully!');
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      try {
        const idToken = await firebaseUser.getIdToken();
        const response = await axiosPublic.get('/profile', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        console.log('refreshUser - fetched data:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        setUser(null);
      }
    }
  };

  const authInfo = {
    user,
    setUser,
    loading,
    register,
    login,
    googleSignIn,
    logout,
    refreshUser,
    axiosPublic, // Make axiosPublic available through context
    firebaseUser, // Expose firebaseUser
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};