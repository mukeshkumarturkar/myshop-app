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
  console.log('🔴 App.tsx: App component function called');

  useEffect(() => {
    console.log('🔴 App.tsx: useEffect hook mounted - App is initialized!');

    // Try to get the root element
    const rootDiv = document.getElementById('root');
    console.log('🔴 App.tsx: Root div element:', rootDiv ? 'FOUND ✓' : 'NOT FOUND ✗');
    console.log('🔴 App.tsx: Root div classes:', rootDiv?.className);
    console.log('🔴 App.tsx: Root div parent:', rootDiv?.parentElement?.tagName);
  }, []);

  try {
    console.log('🔴 App.tsx: About to render HomePage component');

    const homePage = <HomePage />;
    console.log('🔴 App.tsx: HomePage JSX created successfully');

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        {homePage}
      </div>
    );
  } catch (error) {
    console.error('🔴 App.tsx: ERROR rendering HomePage:', error);
    console.error('🔴 App.tsx: Error stack:', error instanceof Error ? error.stack : 'N/A');

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
        color: '#000',
      }}>
        <h1 style={{ color: 'red' }}>❌ Error in App Component</h1>
        <p style={{ fontSize: '16px', maxWidth: '600px', wordWrap: 'break-word' }}>
          {String(error)}
        </p>
        <pre style={{
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderRadius: '5px',
          maxWidth: '600px',
          overflow: 'auto',
          fontSize: '12px',
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

