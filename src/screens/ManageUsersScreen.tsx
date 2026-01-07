import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManageUsersScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'reset'>('add');

  // Add User Form
  const [addUserForm, setAddUserForm] = useState({
    email: '',
    mobileCountryCode: '91',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  // Reset Password Form
  const [resetPasswordForm, setResetPasswordForm] = useState({
    userId: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    loadShopId();
  }, []);

  const loadShopId = async () => {
    const id = await AsyncStorage.getItem('shopId');
    if (id) {
      setShopId(id);
    }
  };

  const handleAddUser = async () => {
    if (!shopId) {
      alert('Shop ID not found');
      return;
    }

    if (!addUserForm.email || !addUserForm.mobileNumber || !addUserForm.password || !addUserForm.confirmPassword) {
      alert('Please fill all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addUserForm.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate mobile number (should be 10 digits)
    if (addUserForm.mobileNumber.length < 10) {
      alert('Please enter a valid mobile number (minimum 10 digits)');
      return;
    }

    if (addUserForm.password !== addUserForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (addUserForm.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.createUser({
        shopId,
        email: addUserForm.email,
        mobileCountryCode: addUserForm.mobileCountryCode,
        mobileNumber: addUserForm.mobileNumber,
        password: addUserForm.password,
        confirmPassword: addUserForm.confirmPassword,
      });

      console.log('User created:', response);
      alert(`User created successfully!\nUser ID: ${addUserForm.mobileCountryCode}${addUserForm.mobileNumber}`);
      setAddUserForm({
        email: '',
        mobileCountryCode: '91',
        mobileNumber: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert('Failed to create user: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordForm.userId || !resetPasswordForm.oldPassword ||
        !resetPasswordForm.newPassword || !resetPasswordForm.confirmNewPassword) {
      alert('Please fill all fields');
      return;
    }

    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }

    if (resetPasswordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.resetPassword(resetPasswordForm);

      console.log('Password reset:', response);
      alert('Password reset successfully!');
      setResetPasswordForm({
        userId: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingBottom: '50px',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#6C63FF',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigation?.goBack()}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
            }}
          >
            ←
          </button>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
            margin: 0,
          }}>Manage Users</h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: '#fff',
        margin: '20px',
        borderRadius: '10px 10px 0 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
      }}>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            flex: 1,
            padding: '15px',
            backgroundColor: activeTab === 'add' ? '#6C63FF' : '#fff',
            color: activeTab === 'add' ? '#fff' : '#666',
            border: 'none',
            borderRadius: '10px 0 0 0',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            borderBottom: activeTab === 'add' ? 'none' : '2px solid #eee',
          }}
        >
          Add New User
        </button>
        <button
          onClick={() => setActiveTab('reset')}
          style={{
            flex: 1,
            padding: '15px',
            backgroundColor: activeTab === 'reset' ? '#6C63FF' : '#fff',
            color: activeTab === 'reset' ? '#fff' : '#666',
            border: 'none',
            borderRadius: '0 10px 0 0',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            borderBottom: activeTab === 'reset' ? 'none' : '2px solid #eee',
          }}
        >
          Reset Password
        </button>
      </div>

      {/* Content */}
      <div style={{
        backgroundColor: '#fff',
        margin: '0 20px 20px 20px',
        padding: '25px',
        borderRadius: '0 0 10px 10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        {activeTab === 'add' ? (
          // Add User Form
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginTop: 0,
              marginBottom: '20px',
            }}>Create New User Account</h2>

            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              lineHeight: '1.6',
            }}>
              Create a new user account for this shop. The user can login using their mobile number or email as User ID.
            </p>

            {shopId && (
              <div style={{
                backgroundColor: '#f0edff',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#6C63FF',
                  margin: 0,
                }}>
                  <strong>Shop ID:</strong> {shopId}
                </p>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>Email Address *</label>
              <input
                type="email"
                value={addUserForm.email}
                onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="user@example.com"
              />
            </div>

            {/* Mobile Number */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>Mobile Number *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={addUserForm.mobileCountryCode}
                  onChange={(e) => setAddUserForm({ ...addUserForm, mobileCountryCode: e.target.value })}
                  style={{
                    width: '80px',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="+91"
                />
                <input
                  type="text"
                  value={addUserForm.mobileNumber}
                  onChange={(e) => setAddUserForm({ ...addUserForm, mobileNumber: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  placeholder="9876543210"
                />
              </div>
              <small style={{ fontSize: '12px', color: '#666', marginTop: '5px', display: 'block' }}>
                User ID will be: {addUserForm.mobileCountryCode}{addUserForm.mobileNumber || 'XXXXXXXXXX'}
              </small>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>Password *</label>
              <input
                type="password"
                value={addUserForm.password}
                onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Enter password (min 6 characters)"
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>Confirm Password *</label>
              <input
                type="password"
                value={addUserForm.confirmPassword}
                onChange={(e) => setAddUserForm({ ...addUserForm, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Confirm password"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddUser}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#6C63FF',
                color: '#fff',
                padding: '14px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        ) : (
          // Reset Password Form
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginTop: 0,
              marginBottom: '20px',
            }}>Reset User Password</h2>

            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              lineHeight: '1.6',
            }}>
              Reset password for an existing user. User ID is the mobile number (country code + number).
            </p>

            {/* User ID */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>User ID (Mobile Number) *</label>
              <input
                type="text"
                value={resetPasswordForm.userId}
                onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, userId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="e.g., 919876543210"
              />
            </div>

            {/* Old Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>Old Password *</label>
              <input
                type="password"
                value={resetPasswordForm.oldPassword}
                onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, oldPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Enter current password"
              />
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>New Password *</label>
              <input
                type="password"
                value={resetPasswordForm.newPassword}
                onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            {/* Confirm New Password */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px',
              }}>Confirm New Password *</label>
              <input
                type="password"
                value={resetPasswordForm.confirmNewPassword}
                onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, confirmNewPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="Confirm new password"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleResetPassword}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#6C63FF',
                color: '#fff',
                padding: '14px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

