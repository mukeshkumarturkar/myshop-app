import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

const ManageUsersScreen = ({ navigation }: any) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone_country_code: '91',
    phone_number: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        alert('Shop ID not found');
        return;
      }
      const response = await apiClient.getShopUsers(shopId);
      setUsers(response.data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Please enter name and email');
      return;
    }

    setLoading(true);
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        alert('Shop ID not found');
        return;
      }

      await apiClient.addShopUser(shopId, {
        name: newUser.name,
        email: newUser.email,
        phone_country_code: newUser.phone_country_code,
        phone_number: newUser.phone_number,
      });

      alert('User added successfully');
      setNewUser({
        name: '',
        email: '',
        phone_country_code: '91',
        phone_number: '',
      });
      loadUsers();
    } catch (error: any) {
      alert('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await apiClient.removeShopUser(userId);
        alert('User removed successfully');
        loadUsers();
      } catch (error: any) {
        alert('Failed to remove user');
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
        }}>
          Manage Users
        </h1>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#333',
          }}>
            Authorized Users
          </h2>

          {users && users.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Phone</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#333' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#333' }}>{user.name}</td>
                      <td style={{ padding: '12px', color: '#333' }}>{user.email}</td>
                      <td style={{ padding: '12px', color: '#333' }}>
                        {user.phone_country_code && user.phone_number
                          ? `+${user.phone_country_code} ${user.phone_number}`
                          : 'N/A'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleRemoveUser(user._id)}
                          style={{
                            backgroundColor: '#e74c3c',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              No users added yet
            </p>
          )}
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#333',
          }}>
            Add New User
          </h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
              Name
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
              Email
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
              Phone Number
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: '#f9f9f9',
              }}>
                +{newUser.phone_country_code}
              </div>
              <input
                type="tel"
                placeholder="10-digit number"
                value={newUser.phone_number}
                onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                maxLength={10}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleAddUser}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#6C63FF',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersScreen;

