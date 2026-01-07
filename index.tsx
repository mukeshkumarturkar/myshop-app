import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './src/store';

console.log('🔴 index.tsx: Module loaded');
console.log('🔴 index.tsx: Store imported:', store ? '✓' : '✗');

if (store) {
  try {
    const state = store.getState();
    console.log('🔴 index.tsx: Store state:', state);
  } catch (err) {
    console.error('🔴 index.tsx: Error getting store state:', err);
  }
}

console.log('🔴 index.tsx: About to create default export');

// Super simple - just return Provider with App
function Root() {
  console.log('🔴 index.tsx: Root component rendering');

  try {
    console.log('🔴 index.tsx: Creating Provider...');
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  } catch (error) {
    console.error('🔴 ERROR in Root:', error);
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'Arial',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Error Loading App</h1>
          <p>{String(error)}</p>
        </div>
      </div>
    );
  }
}

console.log('🔴 index.tsx: Root function defined, exporting as default');

export default Root;

// CRITICAL FIX: Directly render to DOM using ReactDOM
// This bypasses Expo's rendering issues on web
console.log('🔴 index.tsx: Attempting direct ReactDOM render to DOM');

if (typeof document !== 'undefined') {
  console.log('🔴 index.tsx: Browser environment detected');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    console.log('🔴 index.tsx: DOM still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('🔴 index.tsx: DOMContentLoaded fired, rendering now');
      renderApp();
    });
  } else {
    console.log('🔴 index.tsx: DOM already ready, rendering now');
    renderApp();
  }
} else {
  console.log('🔴 index.tsx: Not in browser environment');
}

function renderApp() {
  console.log('🔴 index.tsx: renderApp() called');

  try {
    const root = document.getElementById('root');
    console.log('🔴 index.tsx: Root element found?', root ? 'YES ✓' : 'NO ✗');

    if (root) {
      console.log('🔴 index.tsx: Creating React root and rendering');
      const reactRoot = createRoot(root);
      reactRoot.render(<Root />);
      console.log('🔴 index.tsx: RENDERED SUCCESSFULLY! ✓✓✓');
    } else {
      console.error('🔴 index.tsx: CRITICAL - Root element not found!');
      // Fallback: create root element
      const fallbackRoot = document.createElement('div');
      fallbackRoot.id = 'root';
      fallbackRoot.style.width = '100%';
      fallbackRoot.style.height = '100vh';
      document.body.appendChild(fallbackRoot);
      console.log('🔴 index.tsx: Created fallback root element');

      const reactRoot = createRoot(fallbackRoot);
      reactRoot.render(<Root />);
      console.log('🔴 index.tsx: Rendered to fallback root');
    }
  } catch (error) {
    console.error('🔴 index.tsx: ERROR during render:', error);
    console.error('🔴 index.tsx: Error stack:', error instanceof Error ? error.stack : 'N/A');
  }
}

