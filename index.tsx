import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './src/store';
import './src/styles/global.css';

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
    // CRITICAL FIX: Inject global CSS to fix React Navigation layout issues
    const style = document.createElement('style');
    style.innerHTML = `
      /* Ensure root and main containers are properly sized and visible */
      #root {
        width: 100% !important;
        height: 100vh !important;
        position: relative !important;
        overflow: visible !important;
      }

      /* Force navigation containers to take full height */
      #root > div,
      #root > div > div {
        width: 100%;
        min-height: 100vh;
      }

      /* Make sure tab content is visible and takes full space */
      [role="tabpanel"],
      [class*="css-view"] {
        width: 100% !important;
        min-height: 100vh !important;
        position: relative !important;
        display: flex !important;
        flex-direction: column !important;
      }

      /* CRITICAL FIX: HomePage container position */
      #homepage-container {
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        z-index: 10 !important;
        width: 100% !important;
        min-height: 100vh !important;
        display: block !important;
        transform: none !important;
      }

      /* Fix parent containers that might have negative positioning */
      #homepage-container,
      #homepage-container > *,
      .css-view-g5y9jx {
        transform: translateY(0) !important;
      }

      /* Remove hidden overlays */
      [style*="position: absolute"][style*="visibility: hidden"],
      [style*="pointer-events: none"][style*="visibility: hidden"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    console.log('🔴 index.tsx: Global CSS injected to fix layout');

    const root = document.getElementById('root');
    console.log('🔴 index.tsx: Root element found?', root ? 'YES ✓' : 'NO ✗');

    if (root) {
      console.log('🔴 index.tsx: Creating React root and rendering');

      // Add mutation observer to catch visibility changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const target = mutation.target as HTMLElement;
            if (target.style.visibility === 'hidden') {
              console.warn('🔴 index.tsx: CAUGHT visibility:hidden on element:', target);
              target.style.visibility = 'visible';
              target.style.opacity = '1';
              console.log('🔴 index.tsx: FORCED visibility to visible');
            }
          }
        });
      });

      observer.observe(root, {
        attributes: true,
        attributeFilter: ['style'],
        subtree: true,
      });
      console.log('🔴 index.tsx: Mutation observer installed to prevent hiding');

      // AGGRESSIVE FIX: Periodically remove hidden overlay divs and fix positioning
      const removeHiddenOverlays = () => {
        const hiddenDivs = document.querySelectorAll('[style*="visibility: hidden"], [style*="visibility:hidden"]');
        hiddenDivs.forEach((div) => {
          if (div !== root && div.parentElement === root) {
            console.warn('🔴 index.tsx: REMOVING hidden overlay div:', div);
            div.remove();
          } else if ((div as HTMLElement).style.visibility === 'hidden') {
            console.warn('🔴 index.tsx: FORCING visibility on:', div);
            (div as HTMLElement).style.visibility = 'visible';
            (div as HTMLElement).style.opacity = '1';
          }
        });

        // CRITICAL FIX: Force HomePage container to be in viewport
        const homepageContainer = document.getElementById('homepage-container');
        if (homepageContainer) {
          const rect = homepageContainer.getBoundingClientRect();

          // If container is off-screen (negative top), scroll it into view
          if (rect.top < 0) {
            console.warn('🔴 index.tsx: HomePage is OFF-SCREEN (top:', rect.top, '), scrolling into view');
            homepageContainer.scrollIntoView({ behavior: 'auto', block: 'start' });

            // Also try to fix parent positioning
            let parent = homepageContainer.parentElement;
            while (parent && parent !== root) {
              (parent as HTMLElement).style.transform = 'none';
              parent = parent.parentElement;
            }
          }
        }
      };

      // Run immediately and then every 500ms for the first 10 seconds
      removeHiddenOverlays();
      const intervalId = setInterval(removeHiddenOverlays, 500);
      setTimeout(() => {
        clearInterval(intervalId);
        console.log('🔴 index.tsx: Stopped periodic overlay removal');
      }, 10000);

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

