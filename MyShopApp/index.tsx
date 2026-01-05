import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import store from './src/store';

// Expo will use this as the entry point for web
export default function Main() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

