import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

const EditShopScreen = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (route?.params?.shop) {
      setFormData(route.params.shop);
    } else {
      loadShopData();
    }
  }, []);

  const loadShopData = async () => {
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) return;

      const response = await apiClient.getShop(shopId);
      setFormData(response.data);
    } catch (error: any) {
      console.error('Error loading shop:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (!formData.name.trim() || !formData.owner.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        alert('Shop ID not found');
        return;
      }

      await apiClient.updateShop(shopId, formData);
      alert('Shop details updated successfully');
      navigation?.goBack();
    } catch (error: any) {
      alert('Failed to update shop details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
        }}>
          Edit Shop Details
        </h1>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '5px',
              color: '#333',
            }}>
              Shop Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '5px',
              color: '#333',
            }}>
              Owner Name *
            </label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
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
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '5px',
              color: '#333',
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '5px',
              color: '#333',
            }}>
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                minHeight: '80px',
                fontFamily: 'Arial, sans-serif',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: '#6C63FF',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => navigation?.goBack()}
              style={{
                flex: 1,
                backgroundColor: '#95a5a6',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShopScreen;

