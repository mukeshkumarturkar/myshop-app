import React, { useEffect } from 'react';
import HomePage from './src/screens/HomePage';

console.log('🔴 App.tsx: Importing HomePage...');

export async function getSSRConfig() {
  console.log('🔴 App.tsx: getSSRConfig() called');
  return {
    defer: true,
  };
}

export default function App() {
  console.log('🔴 App.tsx: App component rendering');

  useEffect(() => {
    console.log('🔴 App.tsx: useEffect hook mounted');

    // Show alert that app has started
    const alertMsg = 'MyShop App Started Successfully!\n\nHomePage should be rendering now...';
    console.warn(alertMsg);
  }, []);

  // Fallback render with error handling
  try {
    console.log('🔴 App.tsx: About to render HomePage component');
    return (
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        <HomePage />
      </div>
    );
  } catch (error) {
    console.error('🔴 App.tsx: ERROR rendering HomePage:', error);
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
        <h1 style={{ color: 'red' }}>❌ Error Loading App</h1>
        <p>{String(error)}</p>
        <pre style={{
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderRadius: '5px',
          maxWidth: '600px',
          overflow: 'auto',
        }}>
          {error instanceof Error ? error.stack : String(error)}
        </pre>
        <p style={{ color: '#999', marginTop: '20px', fontSize: '12px' }}>
          Check browser console (F12) for more details
        </p>
      </div>
    );
  }
}

