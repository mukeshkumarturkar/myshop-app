import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebase';
import { setUser, logout } from '../src/store/authSlice';
import RootNavigator from '../src/navigation/RootNavigator';
import { RootState } from '../src/store';

export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Check Firebase authentication state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          const displayName = await AsyncStorage.getItem('userDisplayName') ||
                            firebaseUser.displayName ||
                            'User';

          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: displayName,
            })
          );
        } else {
          // User is signed out
          dispatch(logout());
        }
      } catch (error) {
        console.error('Auth state error:', error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (loading) {
    // Show splash screen or loading indicator
    return null;
  }

  return <RootNavigator />;
}

