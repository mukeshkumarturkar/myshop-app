import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './src/store/authSlice';

console.log('🔴 App.tsx: App module loaded');

export async function getSSRConfig() {
  console.log('🔴 App.tsx: getSSRConfig() called');
  return {
    defer: true,
  };
}

// Initialize auth state from storage
const initializeAuth = async () => {
  try {
    console.log('🔴 App.tsx: Checking for stored auth session');
    const authToken = await AsyncStorage.getItem('authToken');
    const shopId = await AsyncStorage.getItem('shopId');
    const email = await AsyncStorage.getItem('userEmail');
    const shopName = await AsyncStorage.getItem('shopName');

    if (authToken && shopId) {
      console.log('🔴 App.tsx: Found stored session, restoring user');
      store.dispatch(setUser({
        uid: shopId,
        email: email || 'user@example.com',
        displayName: shopName || 'Shop Owner',
        shopName: shopName || undefined,
      }));
      console.log('🔴 App.tsx: User session restored successfully');
    } else {
      console.log('🔴 App.tsx: No stored session found');
    }
  } catch (error) {
    console.error('🔴 App.tsx: Error initializing auth:', error);
  }
};

// Run auth initialization immediately
initializeAuth();

export default function App() {
  console.log('🔴 App.tsx: App component rendering');

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

