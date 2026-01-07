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
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogsLoading, setCatalogsLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [showAddCatalog, setShowAddCatalog] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<any>(null);
  const [catalogForm, setCatalogForm] = useState({
    name: '',
    category: '',
    unit: '',
    price: '',
    currency: 'INR',
    startTime: '09:00',
    endTime: '21:00',
    available: true,
  });

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
      // Load catalogs separately for this shop
      if (route.params.shop.id) {
        loadCatalogs(route.params.shop.id);
      }
    }
  }, [route?.params]);

  useEffect(() => {
    // Load catalogs when shop data is loaded from API
    if (shopData?.id && !route?.params?.shop) {
      loadCatalogs(shopData.id);
    }
  }, [shopData]);

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
        // Catalogs will be loaded separately by useEffect watching shopData
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

  const loadCatalogs = async (shopId: string) => {
    try {
      setCatalogsLoading(true);
      setCatalogError(null); // Clear previous errors
      console.log('🔴 HomePage: Loading catalogs for shop:', shopId);
      const catalogsData = await apiClient.getCatalogsByShopId(shopId);
      console.log('🔴 HomePage: Loaded catalogs:', catalogsData);

      // Handle empty object {} or array response
      if (Array.isArray(catalogsData)) {
        setCatalogs(catalogsData);
        setCatalogError(null);
      } else if (catalogsData && typeof catalogsData === 'object' && Object.keys(catalogsData).length === 0) {
        // Empty object {} - no catalogs
        console.log('🔴 HomePage: Catalog API returned empty object, setting empty array');
        setCatalogs([]);
        setCatalogError('No catalogs found for this shop yet. Click "Add Catalog" to create your first item!');
      } else {
        // Unexpected response
        console.log('🔴 HomePage: Unexpected catalog response:', typeof catalogsData);
        setCatalogs([]);
        setCatalogError('No catalogs found for this shop yet. Click "Add Catalog" to create your first item!');
      }
    } catch (error: any) {
      console.error('🔴 HomePage: Error loading catalogs:', error);

      // Set user-friendly error message
      if (error.response?.status === 404) {
        setCatalogError('No catalogs found for this shop yet. Click "Add Catalog" to create your first item!');
      } else if (error.message === 'Network Error') {
        setCatalogError('Network error: Unable to load catalogs. Please check your connection.');
      } else {
        setCatalogError('Unable to load catalogs at this time. You can still add new items.');
      }

      setCatalogs([]); // Set empty array so the rest of the page works
    } finally {
      setCatalogsLoading(false);
    }
  };

  const handleAddCatalog = async () => {
    if (!shopData?.id) {
      window.alert('Error: Shop ID not available');
      return;
    }

    if (!catalogForm.name || !catalogForm.category || !catalogForm.price) {
      window.alert('Please fill in all required fields (Name, Category, Price)');
      return;
    }

    try {
      const newCatalog = {
        name: catalogForm.name,
        category: catalogForm.category,
        unit: catalogForm.unit || 'Per Piece',
        price: {
          currency: catalogForm.currency,
          value: parseFloat(catalogForm.price),
        },
        availability: {
          startTime: catalogForm.startTime,
          endTime: catalogForm.endTime,
          available: catalogForm.available,
        },
      };

      console.log('🔴 HomePage: Creating catalog:', newCatalog);
      await apiClient.createCatalog(shopData.id, newCatalog);
      window.alert('Catalog item added successfully!');

      // Reset form and reload catalogs
      setCatalogForm({
        name: '',
        category: '',
        unit: '',
        price: '',
        currency: 'INR',
        startTime: '09:00',
        endTime: '21:00',
        available: true,
      });
      setShowAddCatalog(false);
      loadCatalogs(shopData.id);
    } catch (error: any) {
      console.error('🔴 HomePage: Error adding catalog:', error);
      window.alert('Error: ' + (error.response?.data?.message || 'Failed to add catalog item'));
    }
  };

  const handleEditCatalog = async () => {
    if (!editingCatalog?.id) {
      window.alert('Error: No catalog selected for editing');
      return;
    }

    if (!catalogForm.name || !catalogForm.category || !catalogForm.price) {
      window.alert('Please fill in all required fields (Name, Category, Price)');
      return;
    }

    try {
      const updatedCatalog = {
        name: catalogForm.name,
        category: catalogForm.category,
        shopId: shopData.id,
        unit: catalogForm.unit || 'Per Piece',
        price: {
          currency: catalogForm.currency,
          value: parseFloat(catalogForm.price),
        },
        availability: {
          startTime: catalogForm.startTime,
          endTime: catalogForm.endTime,
          available: catalogForm.available,
        },
      };

      console.log('🔴 HomePage: Updating catalog:', editingCatalog.id, updatedCatalog);
      await apiClient.updateCatalog(editingCatalog.id, updatedCatalog);
      window.alert('Catalog item updated successfully!');

      // Reset form and reload catalogs
      setEditingCatalog(null);
      setCatalogForm({
        name: '',
        category: '',
        unit: '',
        price: '',
        currency: 'INR',
        startTime: '09:00',
        endTime: '21:00',
        available: true,
      });
      loadCatalogs(shopData.id);
    } catch (error: any) {
      console.error('🔴 HomePage: Error updating catalog:', error);
      window.alert('Error: ' + (error.response?.data?.message || 'Failed to update catalog item'));
    }
  };

  const handleDeleteCatalog = async (catalogId: string, catalogName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${catalogName}"?`)) {
      return;
    }

    try {
      console.log('🔴 HomePage: Deleting catalog:', catalogId);
      await apiClient.deleteCatalog(catalogId);
      window.alert('Catalog item deleted successfully!');
      loadCatalogs(shopData.id);
    } catch (error: any) {
      console.error('🔴 HomePage: Error deleting catalog:', error);
      window.alert('Error: ' + (error.response?.data?.message || 'Failed to delete catalog item'));
    }
  };

  const startEditCatalog = (catalog: any) => {
    setEditingCatalog(catalog);
    setCatalogForm({
      name: catalog.name,
      category: catalog.category,
      unit: catalog.unit || '',
      price: catalog.price?.value?.toString() || '',
      currency: catalog.price?.currency || 'INR',
      startTime: catalog.availability?.startTime || '09:00',
      endTime: catalog.availability?.endTime || '21:00',
      available: catalog.availability?.available !== false,
    });
    setShowAddCatalog(false);
  };

  const cancelEdit = () => {
    setEditingCatalog(null);
    setCatalogForm({
      name: '',
      category: '',
      unit: '',
      price: '',
      currency: 'INR',
      startTime: '09:00',
      endTime: '21:00',
      available: true,
    });
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
  console.log('🔴 HomePage: catalogs state:', catalogs);
  console.log('🔴 HomePage: catalogs length:', catalogs?.length);
  console.log('🔴 HomePage: catalogsLoading:', catalogsLoading);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      overflowY: 'auto',
      paddingBottom: '50px',
    }}>
      {/* DEBUG BANNER - HIGHLY VISIBLE */}
      <div style={{
        backgroundColor: '#FF0000',
        color: '#FFFFFF',
        padding: '20px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        borderBottom: '5px solid #000',
        position: 'sticky',
        top: 0,
        zIndex: 9999,
      }}>
        ✅ HOMEPAGE LOADED! Shop: {shopData.name} | Catalogs: {catalogs.length}
      </div>

      {/* Header */}
      <div style={{
        backgroundColor: '#6C63FF',
        padding: '20px',
        paddingTop: '40px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '5px',
          margin: 0,
        }}>{shopData.name || 'My Shop'}</h1>
        <p style={{
          fontSize: '14px',
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

      {/* Catalog Management Section */}
      <div style={{
        backgroundColor: '#fff',
        margin: '15px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            margin: 0,
          }}>Catalog Items ({catalogs.length})</h2>
          <button
            onClick={() => {
              setShowAddCatalog(true);
              setEditingCatalog(null);
              cancelEdit();
            }}
            style={{
              backgroundColor: '#6C63FF',
              color: '#fff',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            + Add Catalog
          </button>
        </div>

        {/* Add/Edit Catalog Form */}
        {(showAddCatalog || editingCatalog) && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e0e0e0',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              marginTop: 0,
              marginBottom: '15px',
            }}>{editingCatalog ? 'Edit Catalog Item' : 'Add New Catalog Item'}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Item Name *
                </label>
                <input
                  type="text"
                  value={catalogForm.name}
                  onChange={(e) => setCatalogForm({ ...catalogForm, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Category *
                </label>
                <input
                  type="text"
                  value={catalogForm.category}
                  onChange={(e) => setCatalogForm({ ...catalogForm, category: e.target.value })}
                  placeholder="e.g., Pizza, Beverages"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Price * (₹)
                </label>
                <input
                  type="number"
                  value={catalogForm.price}
                  onChange={(e) => setCatalogForm({ ...catalogForm, price: e.target.value })}
                  placeholder="350"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Unit
                </label>
                <input
                  type="text"
                  value={catalogForm.unit}
                  onChange={(e) => setCatalogForm({ ...catalogForm, unit: e.target.value })}
                  placeholder="Per Piece"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Currency
                </label>
                <select
                  value={catalogForm.currency}
                  onChange={(e) => setCatalogForm({ ...catalogForm, currency: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                  Start Time
                </label>
                <input
                  type="time"
                  value={catalogForm.startTime}
                  onChange={(e) => setCatalogForm({ ...catalogForm, startTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>
                  End Time
                </label>
                <input
                  type="time"
                  value={catalogForm.endTime}
                  onChange={(e) => setCatalogForm({ ...catalogForm, endTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={editingCatalog ? handleEditCatalog : handleAddCatalog}
                style={{
                  backgroundColor: '#6C63FF',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                {editingCatalog ? '💾 Update Item' : '➕ Add Item'}
              </button>
              <button
                onClick={() => {
                  setShowAddCatalog(false);
                  cancelEdit();
                }}
                style={{
                  backgroundColor: '#fff',
                  color: '#666',
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Catalogs List */}
        {catalogError && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '24px' }}>ℹ️</span>
            <div style={{ flex: 1 }}>
              <p style={{
                margin: 0,
                color: '#856404',
                fontSize: '14px',
                fontWeight: '500',
              }}>
                {catalogError}
              </p>
            </div>
          </div>
        )}

        {catalogsLoading ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>Loading catalogs...</p>
        ) : catalogs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '20px' }}>
            {catalogError ? 'Ready to add your first catalog item!' : 'No catalog items yet. Click "Add Catalog" to create your first item!'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {catalogs.map((catalog: any, index: number) => (
              <div
                key={catalog.id || index}
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333',
                      margin: 0,
                    }}>{catalog.name}</h4>
                    <span style={{
                      fontSize: '12px',
                      color: '#6C63FF',
                      backgroundColor: '#e8eaff',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}>{catalog.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>
                      {catalog.price?.currency === 'INR' ? '₹' : catalog.price?.currency === 'USD' ? '$' : '€'}
                      {catalog.price?.value}
                    </span>
                    <span>Unit: {catalog.unit || 'N/A'}</span>
                    {catalog.availability && (
                      <span>⏰ {catalog.availability.startTime} - {catalog.availability.endTime}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => startEditCatalog(catalog)}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCatalog(catalog.id, catalog.name)}
                    style={{
                      backgroundColor: '#f44336',
                      color: '#fff',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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


