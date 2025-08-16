import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
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
          console.log('onAuthStateChanged - Firebase ID Token:', idToken ? idToken.substring(0, 50) + '...' : 'None');
          localStorage.setItem('token', idToken); // Store the token
          console.log('onAuthStateChanged - Token stored in localStorage.');

          // We only send minimal info to the backend to get the user profile
          console.log('onAuthStateChanged - Calling upsertFirebaseUser with:', { uid: currentUser.uid, email: currentUser.email });
          const response = await axiosPublic.post('/users/upsertFirebaseUser', {
            uid: currentUser.uid,
            email: currentUser.email,
            // We avoid sending name and photoURL on every auth change
            // to prevent overwriting the database with stale Firebase data.
            // The registration and profile update flows are responsible for that.
          });

          console.log('onAuthStateChanged - Backend response from upsertFirebaseUser:', response.data);
          setUser(response.data); // Set user state from our backend's source of truth
          console.log('onAuthStateChanged - User state after setUser:', response.data);
          queryClient.invalidateQueries({ queryKey: ['userProfile', currentUser.uid] });

        } catch (error) {
          console.error('onAuthStateChanged - Failed to process user authentication:', error.response?.data || error.message);
          setUser(null);
          localStorage.removeItem('token');
          console.log('onAuthStateChanged - Token removed from localStorage due to error.');
        } finally {
          setLoading(false);
          console.log('onAuthStateChanged - Loading state after setLoading(false):', false);
        }
      } else {
        console.log('onAuthStateChanged - No current user. Clearing state.');
        setUser(null);
        localStorage.removeItem('token');
        console.log('onAuthStateChanged - Token removed from localStorage.');
        setLoading(false);
        console.log('onAuthStateChanged - Loading state after setLoading(false) (no user):', false);
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [axiosPublic, queryClient]);

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
    console.log('AuthContext: Initiating Google Sign-In.');
    return signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const currentUser = result.user;
        console.log('AuthContext: Google Sign-In successful. Firebase User:', currentUser.uid);
        const userInfo = {
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || currentUser.email.split('@')[0] || '', // Ensure name is always set
          photoURL: currentUser.photoURL || '', // Ensure photoURL is always set, even if empty
        };
        try {
          console.log('AuthContext: Sending user info to backend for upsert:', userInfo);
          const response = await axiosPublic.post('/users/upsertFirebaseUser', userInfo);
          console.log('AuthContext: Backend upsert response:', response.data);
          setUser(response.data); // Update frontend user state with data from backend
          console.log('AuthContext: User state after Google login upsert:', response.data);
          toast.success('Login successful!');
        } catch (backendError) {
          console.error('AuthContext: Failed to upsert user data to backend after Google login:', backendError);
          toast.error('Google login successful, but failed to sync profile data.');
        }
        return result;
      })
      .catch((error) => {
        console.error('AuthContext: Google login failed:', error.message);
        toast.error(error.message || 'Google login failed.');
        throw error;
      })
      .finally(() => {
        setLoading(false);
        console.log('AuthContext: Loading state after Google login finally:', false);
      });
  };

  const register = async (userData) => {
    const firebaseAuth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, userData.email, userData.password);
      // After creating the user, update their profile in Firebase Auth
      if (firebaseAuth.currentUser) {
        try {
          const photoURL = userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`;
          await updateProfile(firebaseAuth.currentUser, {
            displayName: userData.name,
            photoURL: photoURL,
          });

          // Immediately upsert user data to backend after Firebase profile update
          const userInfoForBackend = {
            uid: firebaseAuth.currentUser.uid,
            email: firebaseAuth.currentUser.email,
            name: userData.name, // Use provided name
            photoURL: photoURL, // Use generated or provided photoURL
          };
          const response = await axiosPublic.post('/users/upsertFirebaseUser', userInfoForBackend);
          setUser(response.data); // Update frontend user state with data from backend

        } catch (updateError) {
          console.error('Profile update or backend upsert failed after registration:', updateError);
          toast.error('Could not set user profile information or sync with backend.');
        }
      }
      return userCredential;
    } catch (error) {
      console.error('Registration failed:', error.message);
      // Provide user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please log in or use a different email.');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
      throw error; // Re-throw the error to be caught by the calling component if needed
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
        // console.log('refreshUser - fetched data:', response.data);
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
    updateProfile, // Expose updateProfile
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