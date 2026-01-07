import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

const CatalogDetailScreen = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: { value: 0, currency: 'Rupees', discountPercentage: 0 },
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (route?.params?.catalog) {
      setFormData(route.params.catalog);
    }
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price.value) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        alert('Shop ID not found');
        return;
      }

      if (route?.params?.catalog?._id) {
        await apiClient.updateCatalog(route.params.catalog._id, formData);
        alert('Item updated successfully');
      } else {
        await apiClient.createCatalog(shopId, formData);
        alert('Item added successfully');
      }

      navigation?.goBack();
    } catch (error: any) {
      alert('Failed to save item');
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
          {route?.params?.catalog ? 'Edit Item' : 'Add New Item'}
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
              Item Name *
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
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                minHeight: '100px',
                fontFamily: 'Arial, sans-serif',
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
              Price *
            </label>
            <input
              type="number"
              value={formData.price?.value || 0}
              onChange={(e) => setFormData({
                ...formData,
                price: { ...formData.price, value: Number(e.target.value) }
              })}
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
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option>ACTIVE</option>
              <option>INACTIVE</option>
              <option>DISCONTINUED</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSave}
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
              {loading ? 'Saving...' : 'Save Item'}
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

export default CatalogDetailScreen;

