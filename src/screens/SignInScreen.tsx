import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiClient } from '../services/api';
import { setUser, setError, setLoading as setLoadingAction } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }: any) => {
  console.log('🔴 SignInScreen: Component Mounted');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  React.useEffect(() => {
    console.log('🔴 SignInScreen: useEffect - Component initialized');
    console.log('🔴 SignInScreen: Navigation prop available:', !!navigation);
    return () => {
      console.log('🔴 SignInScreen: Component unmounting');
    };
  }, [navigation]);

  const handleEmailSignIn = async () => {
    console.log('🔴 SignInScreen: handleEmailSignIn called');
    console.log('🔴 SignInScreen: Email:', email);
    console.log('🔴 SignInScreen: Password entered:', password.length > 0);

    if (!email.trim() || !password.trim()) {
      console.log('🔴 SignInScreen: Validation failed - empty email or password');
      alert('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      console.log('🔴 SignInScreen: PASSWORD MODE - Authenticating with credentials');
      // PASSWORD MODE: With email and password
      const response = await apiClient.authenticate(email, password);
      console.log('🔴 SignInScreen: PASSWORD MODE - Authentication successful');

      if (response.oauth_token) {
        await AsyncStorage.setItem('authToken', response.oauth_token);
      }
      if (response.shopId) {
        await AsyncStorage.setItem('shopId', response.shopId);
      }
      if (response.shop_name) {
        await AsyncStorage.setItem('shopName', response.shop_name);
      }
      // Store email for session restoration
      await AsyncStorage.setItem('userEmail', response.email || email);

      dispatch(setUser({
        uid: response.userId || response.shopId,
        email: response.email || email,
        displayName: response.owner_name || 'Shop Owner',
        shopName: response.shop_name,
      }));

      console.log('🔴 SignInScreen: User dispatched to Redux, navigation will happen automatically');
      console.log('🔴 SignInScreen: Redux state should now be isSignedIn: true');
      // Alert removed - navigation happens automatically via Redux state change
    } catch (error: any) {
      console.error('🔴 SignInScreen: PASSWORD MODE - Sign in error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Sign in failed';
      dispatch(setError(errorMessage));
      alert('Sign In Failed: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    alert('Feature Coming Soon: Phone OTP authentication will be available soon');
  };

  const handleGoogleSignIn = async () => {
    alert('Google Sign-In: Google authentication will be configured with Firebase');
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length < 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    alert('Feature Coming Soon: OTP verification will be implemented soon');
  };

  console.log('🔴 SignInScreen: Render method called - about to return JSX');

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#fff',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '30px 20px',
          backgroundColor: '#6C63FF',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '30px',
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#fff',
            margin: '0 0 5px 0',
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#f0f0f0',
            margin: '5px 0 0 0',
          }}>
            Sign in to manage your shop
          </p>
        </div>

        {/* Method Selector */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
        }}>
          <button
            onClick={() => {
              setSignInMethod('email');
              setOtpSent(false);
            }}
            style={{
              flex: 1,
              padding: '12px 15px',
              border: signInMethod === 'email' ? '2px solid #6C63FF' : '2px solid #ddd',
              backgroundColor: signInMethod === 'email' ? '#f0edff' : '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              color: signInMethod === 'email' ? '#6C63FF' : '#666',
            }}
          >
            📧 Email
          </button>
          <button
            onClick={() => {
              setSignInMethod('phone');
              setOtpSent(false);
            }}
            style={{
              flex: 1,
              padding: '12px 15px',
              border: signInMethod === 'phone' ? '2px solid #6C63FF' : '2px solid #ddd',
              backgroundColor: signInMethod === 'phone' ? '#f0edff' : '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              color: signInMethod === 'phone' ? '#6C63FF' : '#666',
            }}
          >
            📱 Phone
          </button>
        </div>

        {/* Form */}
        <div>
          {signInMethod === 'email' ? (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px 15px',
                    fontSize: '14px',
                    backgroundColor: '#f9f9f9',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px 15px',
                    fontSize: '14px',
                    backgroundColor: '#f9f9f9',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                onClick={handleEmailSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#6C63FF',
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          ) : (
            <div>
              {!otpSent ? (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px',
                    }}>
                      Mobile Number
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '12px 15px',
                        backgroundColor: '#f9f9f9',
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        +{countryCode}
                      </div>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={10}
                        style={{
                          flex: 1,
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          padding: '12px 15px',
                          fontSize: '14px',
                          backgroundColor: '#f9f9f9',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePhoneSignIn}
                    disabled={loading}
                    style={{
                      width: '100%',
                      backgroundColor: '#6C63FF',
                      color: '#fff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{
                    backgroundColor: '#d4edda',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    borderLeft: '3px solid #28a745',
                    fontSize: '13px',
                    color: '#155724',
                  }}>
                    OTP sent to +{countryCode}{phoneNumber}
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px',
                    }}>
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      style={{
                        width: '100%',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '12px 15px',
                        fontSize: '14px',
                        backgroundColor: '#f9f9f9',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    style={{
                      width: '100%',
                      backgroundColor: '#6C63FF',
                      color: '#fff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginBottom: '15px',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  <button
                    onClick={() => setOtpSent(false)}
                    style={{
                      width: '100%',
                      backgroundColor: '#fff',
                      color: '#6C63FF',
                      border: '1px solid #6C63FF',
                      padding: '14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    ← Use different number
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0',
          gap: '10px',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
          <span style={{ color: '#999', fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            border: '1px solid #ddd',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#f9f9f9',
            color: '#333',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          🔐 Sign In with Google
        </button>

        {/* Sign Up Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
            Not Registered?{' '}
            <button
              onClick={() => {
                console.log('🔴 SignInScreen: SIGN UP NOW LINK CLICKED!');
                console.log('🔴 SignInScreen: Navigation prop:', !!navigation);
                if (navigation && navigation.navigate) {
                  navigation.navigate('SignUp');
                  console.log('🔴 SignInScreen: Navigation call successful');
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#6C63FF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Sign Up Now
            </button>
          </p>

          {/* Test Mode Button */}
          <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '14px' }}>
            <button
              onClick={() => {
                console.log('🔴 SignInScreen: TEST MODE - Navigating to HomePage');
                if (navigation && navigation.navigate) {
                  navigation.navigate('Home');
                  console.log('🔴 SignInScreen: Test navigation successful');
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF6B6B',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              🧪 Test Mode - View Shop Demo
            </button>
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: '#e8eaff',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          borderLeft: '4px solid #6C63FF',
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6C63FF',
            lineHeight: '18px',
            fontWeight: '500',
            textAlign: 'center',
            margin: '0',
          }}>
            Don't have a shop yet? Create one now and start managing your menu!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;

