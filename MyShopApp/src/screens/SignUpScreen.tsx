import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiClient } from '../services/api';
import { setUser } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 1 = shop details, 2 = account setup
  const [loading, setLoading] = useState(false);

  const [shopData, setShopData] = useState({
    name: '',
    owner: '',
    email: '',
    address: '',
    mobile_country_code: '91',
    mobile_number: '',
  });

  const [accountData, setAccountData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleContinue = async () => {
    if (!shopData.name.trim() || !shopData.owner.trim() || !shopData.email.trim() || !shopData.address.trim()) {
      alert('Please fill in all shop details');
      return;
    }

    if (shopData.mobile_number.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setStep(2);
  };

  const handleCreateAccount = async () => {
    if (accountData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (accountData.password !== accountData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Get public access token WITHOUT credentials (PUBLIC MODE)
      console.log('🔴 SignUpScreen: Step 1 - Getting public access token (PUBLIC MODE)');
      const publicAuthResponse = await apiClient.authenticate();
      console.log('🔴 SignUpScreen: Got public access token (no credentials needed)');

      // Step 2: Create the shop using shop data + password
      console.log('🔴 SignUpScreen: Step 2 - Creating shop');
      const shopSignupData = {
        ...shopData,
        password: accountData.password,
      };

      const createResponse = await apiClient.createShop(shopSignupData);
      const shopId = createResponse.shopId || createResponse.id;
      console.log('🔴 SignUpScreen: Shop created with ID:', shopId);

      // Step 3: Create user for the shop using PUBLIC access token
      console.log('🔴 SignUpScreen: Step 3 - Creating shop user with public token');
      await apiClient.createUser(shopId, accountData.password, accountData.confirmPassword);
      console.log('🔴 SignUpScreen: Shop user created successfully');

      // Save shop details
      if (shopId) {
        await AsyncStorage.setItem('shopId', shopId);
      }
      if (shopSignupData.name) {
        await AsyncStorage.setItem('shopName', shopSignupData.name);
      }

      dispatch(setUser({
        uid: shopId,
        email: shopData.email,
        displayName: shopData.owner,
        shopName: shopData.name,
      }));

      alert('Account created successfully! Redirecting to Sign In...');
      navigation.replace('SignIn');
    } catch (error: any) {
      console.error('🔴 SignUpScreen: Account creation failed:', error);
      alert('Failed to create account: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#fff',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
            Create Your Shop
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#f0f0f0',
            margin: '5px 0 0 0',
          }}>
            Step {step} of 2
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          gap: '10px',
        }}>
          <div style={{
            flex: 1,
            height: '4px',
            backgroundColor: step >= 1 ? '#6C63FF' : '#ddd',
            borderRadius: '2px',
          }} />
          <div style={{
            flex: 1,
            height: '4px',
            backgroundColor: step >= 2 ? '#6C63FF' : '#ddd',
            borderRadius: '2px',
          }} />
        </div>

        {step === 1 ? (
          // Step 1: Shop Details
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#333',
            }}>
              Shop Details
            </h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                Shop Name *
              </label>
              <input
                type="text"
                placeholder="Enter shop name"
                value={shopData.name}
                onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                Owner Name *
              </label>
              <input
                type="text"
                placeholder="Enter owner name"
                value={shopData.owner}
                onChange={(e) => setShopData({ ...shopData, owner: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                Email *
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={shopData.email}
                onChange={(e) => setShopData({ ...shopData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                Address *
              </label>
              <textarea
                placeholder="Enter shop address"
                value={shopData.address}
                onChange={(e) => setShopData({ ...shopData, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'Arial, sans-serif',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                Mobile Number *
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '12px 15px',
                  backgroundColor: '#f9f9f9',
                }}>
                  +{shopData.mobile_country_code}
                </div>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  maxLength={10}
                  value={shopData.mobile_number}
                  onChange={(e) => setShopData({ ...shopData, mobile_number: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleContinue}
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
                marginTop: '10px',
              }}
            >
              Continue to Account Setup
            </button>
          </div>
        ) : (
          // Step 2: Account Setup
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#333',
            }}>
              Account Setup
            </h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                Password *
              </label>
              <input
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={accountData.password}
                onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                Confirm Password *
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={accountData.confirmPassword}
                onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  backgroundColor: '#95a5a6',
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={loading}
                style={{
                  flex: 1,
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>
        )}

        {/* Sign In Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
        }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigation?.navigate?.('SignIn')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6C63FF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;

