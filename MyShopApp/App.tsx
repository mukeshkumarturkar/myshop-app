import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { authInstance } from './src/config/firebase';
import { setUser, logout } from './src/store/authSlice';
import RootNavigator from './src/navigation/RootNavigator';
import { RootState } from '../src/store';

// Disable static rendering for web build
export async function getSSRConfig() {
  return {
    defer: true,
  };
}

export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [firebaseMissing, setFirebaseMissing] = React.useState(false);

  useEffect(() => {
    // If Firebase is not initialized, skip auth check and show fallback
    if (!authInstance) {
      setFirebaseMissing(true);
      setLoading(false);
      return;
    }

    // Check Firebase authentication state
    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
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
    // Show a visible loading indicator
    return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#666'}}>
        Loading MyShop App...
      </div>
    );
  }

  if (firebaseMissing) {
    // Show a visible error if Firebase is not configured
    return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontSize: 20, color: '#b00', textAlign: 'center'}}>
        <div>⚠️ Firebase is not configured.<br/>Please add your Firebase credentials to run the app fully.</div>
        <div style={{marginTop: 16, color: '#555', fontSize: 16}}>
          The app is running in demo mode.<br/>Some features may be unavailable.
        </div>
      </div>
    );
  }

  return <RootNavigator />;
}
