import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './src/store';

console.log('🔴 index.tsx: Module loaded');
console.log('🔴 index.tsx: Store imported:', store ? '✓' : '✗');

export default function Main() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('🔴 index.tsx: Main component mounted');
    setMounted(true);
  }, []);

  if (error) {
    console.error('🔴 index.tsx: Error detected:', error);
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        fontFamily: 'Arial, sans-serif',
      }}>
        <h1 style={{ color: 'red' }}>❌ Error in Main Component</h1>
        <pre style={{
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderRadius: '5px',
          maxWidth: '600px',
          overflow: 'auto',
        }}>
          {String(error)}
        </pre>
      </div>
    );
  }

  if (!mounted) {
    console.log('🔴 index.tsx: Main not mounted yet, showing loading...');
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}>
        <h1>Initializing MyShop...</h1>
      </div>
    );
  }

  try {
    console.log('🔴 index.tsx: Rendering Provider with store');
    console.log('🔴 index.tsx: Store state:', store.getState());

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  } catch (err) {
    console.error('🔴 index.tsx: CRITICAL ERROR:', err);
    setError(err);
    return null;
  }
}


