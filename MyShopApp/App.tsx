import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import RootNavigator from './src/navigation/RootNavigator';

console.log('🔴 App.tsx: App module loaded');

export async function getSSRConfig() {
  console.log('🔴 App.tsx: getSSRConfig() called');
  return {
    defer: true,
  };
}

export default function App() {
  console.log('🔴 App.tsx: App component rendering');

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

