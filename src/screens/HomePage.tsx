import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { apiClient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('🔴 HomePage.tsx: Module loaded');

export default function HomePage({ route, navigation }: any) {
  console.log('🔴 HomePage: Rendering HomePage component');

  const dispatch = useDispatch();
  const [shopData, setShopData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔴 HomePage: Component mounted');
    loadShopData();

    return () => {
      console.log('🔴 HomePage: Component unmounted');
    };
  }, []);

  useEffect(() => {
    // Check if shop data was passed from SignUpScreen
    if (route?.params?.shop) {
      console.log('🔴 HomePage: Shop data received from params:', route.params.shop);
      setShopData(route.params.shop);
      setLoading(false);
    }
  }, [route?.params]);

  const loadShopData = async () => {
    try {
      // First check if we got shop data from params
      if (route?.params?.shop) {
        console.log('🔴 HomePage: Using shop data from route params, skipping API call');
        return; // Already handled in useEffect above
      }

      // Otherwise, try to load from AsyncStorage
      let shopId = await AsyncStorage.getItem('shopId');
      console.log('🔴 HomePage: Loaded shopId from storage:', shopId);

      // TEST MODE: If no shopId, use the test shop ID
      if (!shopId) {
        shopId = '695d580b2e5090098478fc26';
        console.log('🔴 HomePage: Using TEST SHOP ID:', shopId);
        await AsyncStorage.setItem('shopId', shopId);
      }

      if (shopId) {
        console.log('🔴 HomePage: Fetching shop details for ID:', shopId);
        const shop = await apiClient.getShop(shopId);
        console.log('🔴 HomePage: Fetched shop details:', shop);
        console.log('🔴 HomePage: About to call setShopData with:', { name: shop.name, owner: shop.owner });
        setShopData(shop);
        console.log('🔴 HomePage: setShopData called successfully');
      } else {
        console.log('🔴 HomePage: No shopId found');
      }
    } catch (error) {
      console.error('🔴 HomePage: Error loading shop data:', error);
      window.alert('Error: Failed to load shop details');
    } finally {
      console.log('🔴 HomePage: Setting loading to false in finally block');
      setLoading(false);
    }
  };

  const handleShareQR = async () => {
    if (!shopData?.qrCodeUrl) {
      window.alert('Error: QR code URL not available');
      return;
    }

    try {
      const message = `Check out my shop: ${shopData.name}\nOwner: ${shopData.owner}\n\nScan QR code or visit: ${shopData.qrCodeUrl}`;

      if (navigator.share) {
        await navigator.share({
          title: `${shopData.name} - Shop Menu`,
          text: message,
          url: shopData.qrCodeUrl,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(message);
        window.alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareWhatsApp = async () => {
    if (!shopData?.qrCodeUrl) {
      window.alert('Error: QR code URL not available');
      return;
    }

    try {
      const message = `Check out my shop: ${shopData.name}\nOwner: ${shopData.owner}\n\nVisit: ${shopData.qrCodeUrl}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      window.alert('Error: Failed to open WhatsApp');
    }
  };

  const handleShareTelegram = async () => {
    if (!shopData?.qrCodeUrl) {
      window.alert('Error: QR code URL not available');
      return;
    }

    try {
      const message = `Check out my shop: ${shopData.name}\nOwner: ${shopData.owner}\n\nVisit: ${shopData.qrCodeUrl}`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shopData.qrCodeUrl)}&text=${encodeURIComponent(message)}`;
      window.open(telegramUrl, '_blank');
    } catch (error) {
      console.error('Error opening Telegram:', error);
      window.alert('Error: Failed to open Telegram');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('shopId');
    await AsyncStorage.removeItem('authToken');
    dispatch(setUser(null));
    navigation?.replace('SignIn');
  };

  console.log('🔴 HomePage: About to return JSX');
  console.log('🔴 HomePage: loading =', loading);
  console.log('🔴 HomePage: shopData =', shopData ? 'EXISTS' : 'NULL');
  console.log('🔴 HomePage: shopData.name =', shopData?.name);

  if (loading) {
    console.log('🔴 HomePage: RENDERING LOADING STATE');
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <p style={{
          fontSize: '16px',
          color: '#666',
          textAlign: 'center',
        }}>Loading shop details...</p>
      </div>
    );
  }

  if (!shopData) {
    console.log('🔴 HomePage: RENDERING NO DATA STATE');
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}>
        <p style={{
          fontSize: '16px',
          color: '#ff0000',
          textAlign: 'center',
          marginBottom: '20px',
        }}>No shop data available</p>
        <button
          onClick={() => navigation?.replace('SignIn')}
          style={{
            backgroundColor: '#6C63FF',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  console.log('🔴 HomePage: RENDERING SHOP DATA - Name:', shopData.name);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#6C63FF',
        padding: '30px',
        paddingTop: '60px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '5px',
          margin: 0,
        }}>{shopData.name || 'My Shop'}</h1>
        <p style={{
          fontSize: '16px',
          color: '#f0f0f0',
          margin: 0,
          marginTop: '5px',
        }}>Owner: {shopData.owner || 'N/A'}</p>
      </div>

      {/* Shop Details Card */}
      <div style={{
        backgroundColor: '#fff',
        margin: '15px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '15px',
          marginTop: 0,
        }}>Shop Information</h2>

        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: '600',
            marginRight: '10px',
          }}>Shop Name:</span>
          <span style={{
            fontSize: '16px',
            color: '#333',
          }}>{shopData.name}</span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: '600',
            marginRight: '10px',
          }}>Owner:</span>
          <span style={{
            fontSize: '16px',
            color: '#333',
          }}>{shopData.owner}</span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: '600',
            marginRight: '10px',
          }}>Address:</span>
          <span style={{
            fontSize: '16px',
            color: '#333',
          }}>{shopData.address}</span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: '600',
            marginRight: '10px',
          }}>Email:</span>
          <span style={{
            fontSize: '16px',
            color: '#333',
          }}>{shopData.email}</span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: '600',
            marginRight: '10px',
          }}>Mobile:</span>
          <span style={{
            fontSize: '16px',
            color: '#333',
          }}>+{shopData.mobileCountryCode} {shopData.mobileNumber}</span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: '600',
            marginRight: '10px',
          }}>Shop ID:</span>
          <span style={{
            fontSize: '16px',
            color: '#333',
            fontFamily: 'monospace',
          }}>{shopData.id}</span>
        </div>
      </div>

      {/* QR Code Card */}
      {shopData.qrCode && (
        <div style={{
          backgroundColor: '#fff',
          margin: '15px',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px',
            marginTop: 0,
          }}>Shop QR Code</h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}>
            <img
              src={shopData.qrCode}
              alt="Shop QR Code"
              style={{
                width: '250px',
                height: '250px',
                objectFit: 'contain',
              }}
            />
          </div>

          {shopData.qrCodeUrl && (
            <p style={{
              fontSize: '12px',
              color: '#666',
              textAlign: 'center',
              wordBreak: 'break-all',
              margin: '10px 0',
            }}>{shopData.qrCodeUrl}</p>
          )}

          {/* Share Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '20px',
            justifyContent: 'center',
          }}>
            <button
              onClick={handleShareQR}
              style={{
                backgroundColor: '#6C63FF',
                color: '#fff',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                flex: '1',
                minWidth: '120px',
              }}
            >
              📤 Share
            </button>

            <button
              onClick={handleShareWhatsApp}
              style={{
                backgroundColor: '#25D366',
                color: '#fff',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                flex: '1',
                minWidth: '120px',
              }}
            >
              💬 WhatsApp
            </button>

            <button
              onClick={handleShareTelegram}
              style={{
                backgroundColor: '#0088cc',
                color: '#fff',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                flex: '1',
                minWidth: '120px',
              }}
            >
              ✈️ Telegram
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        margin: '15px',
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
      }}>
        <button
          onClick={() => navigation?.navigate('ManageShop')}
          style={{
            backgroundColor: '#6C63FF',
            color: '#fff',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Manage Shop
        </button>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#fff',
            color: '#6C63FF',
            padding: '15px 30px',
            border: '1px solid #6C63FF',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      {/* Debug Info */}
      <div style={{
        padding: '20px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '12px',
          color: '#6C63FF',
          fontWeight: '600',
          margin: 0,
        }}>✓ Shop loaded successfully</p>
      </div>
    </div>
  );
}


