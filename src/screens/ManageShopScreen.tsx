import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { apiClient } from '../services/api';
import QRCode from 'qrcode.react';

const ManageShopScreen = ({ navigation }: any) => {
  const currentShop = useSelector((state: RootState) => state.shop.currentShop);
  const [loading, setLoading] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    setLoading(true);
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        alert('Shop ID not found');
        return;
      }
      const response = await apiClient.getShop(shopId);
      // Store in Redux or state as needed
    } catch (error: any) {
      console.error('Error loading shop:', error);
      alert('Failed to load shop data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    setGeneratingQR(true);
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        alert('Shop ID not found');
        return;
      }

      const qrElement = document.getElementById('qrcode');
      if (qrElement) {
        const canvas = qrElement.querySelector('canvas');
        if (canvas) {
          setQrCode(canvas.toDataURL('image/png'));
          alert('QR Code generated successfully!');
        }
      }
    } catch (error: any) {
      alert('Failed to generate QR code');
    } finally {
      setGeneratingQR(false);
    }
  };

  const handleShareQR = async () => {
    try {
      if (navigator.share && qrCode) {
        await navigator.share({
          title: 'My Shop QR Code',
          text: 'Scan this to view my menu!',
        });
      } else {
        alert('QR Code: ' + qrCode?.substring(0, 50) + '...');
      }
    } catch (error: any) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentShop) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#d32f2f',
      }}>
        No shop data available
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      minHeight: '100vh',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
        }}>
          Shop Management
        </h1>

        {/* Shop Details Card */}
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
            Shop Details
          </h2>

          <p style={{ marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
            <strong style={{ color: '#666' }}>Shop Name:</strong>
            <span style={{ color: '#333', float: 'right' }}>{currentShop.name}</span>
          </p>
          <p style={{ marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
            <strong style={{ color: '#666' }}>Owner:</strong>
            <span style={{ color: '#333', float: 'right' }}>{currentShop.owner}</span>
          </p>
          <p style={{ marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
            <strong style={{ color: '#666' }}>Email:</strong>
            <span style={{ color: '#333', float: 'right' }}>{currentShop.email || 'N/A'}</span>
          </p>
          <p style={{ marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
            <strong style={{ color: '#666' }}>Address:</strong>
            <span style={{ color: '#333', float: 'right' }}>{currentShop.address}</span>
          </p>

          <button
            onClick={() => navigation?.navigate?.('EditShop', { shop: currentShop })}
            style={{
              width: '100%',
              backgroundColor: '#f39c12',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '15px',
            }}
          >
            Edit Shop Details
          </button>
        </div>

        {/* QR Code Card */}
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
            QR Code
          </h2>

          {qrCode ? (
            <>
              <div style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '15px',
              }}>
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{
                    width: '250px',
                    height: '250px',
                  }}
                />
              </div>
              <p style={{
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                marginBottom: '15px',
                fontStyle: 'italic',
              }}>
                Customers can scan this QR code to view your menu
              </p>
              <button
                onClick={handleShareQR}
                style={{
                  width: '100%',
                  backgroundColor: '#27ae60',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Share QR Code
              </button>
            </>
          ) : (
            <>
              <p style={{
                fontSize: '14px',
                color: '#999',
                textAlign: 'center',
                marginBottom: '15px',
              }}>
                No QR code generated yet
              </p>
              <button
                onClick={handleGenerateQR}
                disabled={generatingQR}
                style={{
                  width: '100%',
                  backgroundColor: '#6C63FF',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  opacity: generatingQR ? 0.6 : 1,
                }}
              >
                {generatingQR ? 'Generating...' : 'Generate QR Code'}
              </button>
            </>
          )}

          {/* Hidden QR Code Generator */}
          <div style={{ display: 'none' }} id="qrcode">
            <QRCode value={currentShop._id || 'shop'} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          marginBottom: '20px',
        }}>
          <button
            onClick={() => navigation?.navigate?.('CatalogList')}
            style={{
              flex: 1,
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Manage Catalog
          </button>

          <button
            onClick={loadShopData}
            style={{
              flex: 1,
              backgroundColor: '#95a5a6',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageShopScreen;

