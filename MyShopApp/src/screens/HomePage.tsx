import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';

console.log('🔴 HomePage.tsx: Module loaded');

export default function HomePage() {
  console.log('🔴 HomePage: Rendering HomePage component');

  const dispatch = useDispatch();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    console.log('🔴 HomePage: Component mounted');
    setRenderCount(prev => prev + 1);
    return () => {
      console.log('🔴 HomePage: Component unmounted');
    };
  }, []);

  const handleLogin = (e: any) => {
    console.log('🔴 HomePage: handleLogin called', { email, password });
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('🔴 HomePage: Dispatching setUser action');
      dispatch(
        setUser({
          uid: 'demo-' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
        })
      );
      console.log('🔴 HomePage: setUser action dispatched successfully');
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    console.log('🔴 HomePage: Render count:', renderCount);
  }, [renderCount]);

  console.log('🔴 HomePage: About to return JSX');

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Header */}
      <h1 style={{
        fontSize: '48px',
        color: '#6C63FF',
        margin: '0 0 10px 0',
        fontWeight: 'bold',
      }}>
        MyShop
      </h1>
      <p style={{
        fontSize: '18px',
        color: '#666',
        margin: '0 0 40px 0',
      }}>
        Manage Your Shop & Catalog
      </p>

      {/* Login Form */}
      <form onSubmit={handleLogin} style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        {/* Email Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontFamily: 'Arial, sans-serif',
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontFamily: 'Arial, sans-serif',
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#6C63FF',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Demo Info */}
        <p style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center',
        }}>
          🚀 Demo Mode: Use any email and password
        </p>
      </form>

      {/* Success Message */}
      <div style={{
        marginTop: '30px',
        fontSize: '14px',
        color: '#6C63FF',
        fontWeight: 'bold',
      }}>
        ✓ App is running successfully!
      </div>

      {/* Debug Overlay - Bottom Right Corner */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: '#000',
        color: '#0f0',
        padding: '10px 15px',
        borderRadius: '4px',
        fontSize: '11px',
        fontFamily: 'monospace',
        maxWidth: '250px',
        boxShadow: '0 0 10px rgba(0,255,0,0.3)',
        border: '1px solid #0f0',
        zIndex: 9999,
      }}>
        <div>🔴 HomePage: OK</div>
        <div>Render #{renderCount}</div>
        <div>Email: {email.substring(0, 10)}...</div>
        <div>Loading: {loading ? 'YES' : 'NO'}</div>
        <div>Time: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

