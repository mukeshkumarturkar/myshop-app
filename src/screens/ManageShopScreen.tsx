import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHOP_TYPES, DEFAULT_SHOP_TYPE } from '../config/shopTypes';

export default function ManageShopScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shopData, setShopData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    owner: '',
    email: '',
    mobileCountryCode: '91',
    mobileNumber: '',
    shopType: DEFAULT_SHOP_TYPE,
    theme: {},
  });

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      const shopId = await AsyncStorage.getItem('shopId');

      if (shopId) {
        const shop = await apiClient.getShop(shopId);
        setShopData(shop);
        setFormData({
          name: shop.name || '',
          address: shop.address || '',
          owner: shop.owner || '',
          email: shop.email || '',
          mobileCountryCode: shop.mobileCountryCode || '91',
          mobileNumber: shop.mobileNumber || '',
          shopType: shop.shopType || DEFAULT_SHOP_TYPE,
          theme: shop.theme || {},
        });
      }
    } catch (error) {
      console.error('Error loading shop:', error);
      alert('Failed to load shop data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!shopData?.id) {
      alert('Shop ID not found');
      return;
    }

    if (!formData.name || !formData.address || !formData.owner || !formData.email || !formData.mobileNumber) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      const updatedShop = await apiClient.updateShop(shopData.id, formData);
      setShopData(updatedShop);
      alert('Shop updated successfully!');
    } catch (error: any) {
      console.error('Error updating shop:', error);
      alert('Failed to update shop: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <p>Loading shop details...</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header - Fixed */}
      <div style={{
        backgroundColor: '#6C63FF',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flexShrink: 0,
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
          }}>Manage Shop</h1>
        </div>
      </div>

      {/* Form - Scrollable */}
      <div
        className="app-content scrollable-content"
        data-scrollable="true"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehaviorY: 'contain',
        }}
      >
      <div style={{
        backgroundColor: '#fff',
        margin: '0 auto',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          marginTop: 0,
          marginBottom: '20px',
        }}>Shop Details</h2>

        {/* Shop Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px',
          }}>Shop Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            placeholder="Enter shop name"
          />
        </div>

        {/* Shop Type */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px',
          }}>Shop Type *</label>
          <select
            value={formData.shopType}
            onChange={(e) => handleInputChange('shopType', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            {SHOP_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px',
          }}>Address *</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              minHeight: '80px',
              fontFamily: 'inherit',
            }}
            placeholder="Enter shop address"
          />
        </div>

        {/* Owner */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px',
          }}>Owner Name *</label>
          <input
            type="text"
            value={formData.owner}
            onChange={(e) => handleInputChange('owner', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            placeholder="Enter owner name"
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px',
          }}>Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            placeholder="Enter email"
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
              value={formData.mobileCountryCode}
              onChange={(e) => handleInputChange('mobileCountryCode', e.target.value)}
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
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button
            onClick={handleUpdate}
            disabled={saving}
            style={{
              flex: 1,
              backgroundColor: '#6C63FF',
              color: '#fff',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Update Shop'}
          </button>

          <button
            onClick={() => navigation?.goBack()}
            style={{
              flex: 1,
              backgroundColor: '#fff',
              color: '#6C63FF',
              padding: '14px',
              border: '2px solid #6C63FF',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

