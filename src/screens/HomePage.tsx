import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/authSlice';
import { RootState } from '../store';
import { apiClient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategoriesForShopType, DEFAULT_CATEGORY } from '../config/categories';
import { ALL_UNITS, searchUnits, DEFAULT_UNIT } from '../config/units';

export default function HomePage({ route, navigation }: any) {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [shopData, setShopData] = useState<any>(null);
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogsLoading, setCatalogsLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [showAddCatalog, setShowAddCatalog] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<readonly string[]>([]);
  const [unitSearch, setUnitSearch] = useState('');
  const [filteredUnits, setFilteredUnits] = useState<readonly string[]>(ALL_UNITS);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [customUnit, setCustomUnit] = useState('');
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

    // Close menu and unit dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu) {
        setShowMenu(false);
      }
      if (showUnitDropdown) {
        setShowUnitDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  // Filter units based on search
  useEffect(() => {
    const filtered = searchUnits(unitSearch);
    setFilteredUnits(filtered);
  }, [unitSearch]);

  useEffect(() => {
    // Check if shop data was passed from SignUpScreen
    if (route?.params?.shop) {
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
        return; // Already handled in useEffect above
      }

      // Otherwise, try to load from AsyncStorage
      let shopId = await AsyncStorage.getItem('shopId');

      // TEST MODE: If no shopId, use the test shop ID
      if (!shopId) {
        shopId = '695d580b2e5090098478fc26';
        await AsyncStorage.setItem('shopId', shopId);
      }

      if (shopId) {
        const shop = await apiClient.getShop(shopId);
        setShopData(shop);

        // Load categories based on shop type
        const categories = getCategoriesForShopType(shop.shopType || 'VEGETABLE_SHOP');
        setAvailableCategories(categories);

        // Catalogs will be loaded separately by useEffect watching shopData
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogs = async (shopId: string) => {
    try {
      setCatalogsLoading(true);
      setCatalogError(null); // Clear previous errors
      const catalogsData = await apiClient.getCatalogsByShopId(shopId);

      // Handle empty object {} or array response
      if (Array.isArray(catalogsData)) {
        setCatalogs(catalogsData);
        setCatalogError(null);
      } else if (catalogsData && typeof catalogsData === 'object' && Object.keys(catalogsData).length === 0) {
        // Empty object {} - no catalogs
        setCatalogs([]);
        setCatalogError('No catalogs found for this shop yet. Click "Add Catalog" to create your first item!');
      } else {
        // Unexpected response
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

      await apiClient.createCatalog(shopData.id, newCatalog);

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
      console.error('Error adding catalog:', error);
    }
  };

  const handleEditCatalog = async () => {
    if (!editingCatalog?.id || !catalogForm.name || !catalogForm.category || !catalogForm.price) {
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

      await apiClient.updateCatalog(editingCatalog.id, updatedCatalog);

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
      console.error('Error updating catalog:', error);
    }
  };

  const handleDeleteCatalog = async (catalogId: string, catalogName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${catalogName}"?`)) {
      return;
    }

    try {
      await apiClient.deleteCatalog(catalogId);
      loadCatalogs(shopData.id);
    } catch (error: any) {
      console.error('Error deleting catalog:', error);
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
    if (!shopData?.qrCodeUrl) return;

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
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareWhatsApp = async () => {
    if (!shopData?.qrCodeUrl) return;

    try {
      const message = `Check out my shop: ${shopData.name}\nOwner: ${shopData.owner}\n\nVisit: ${shopData.qrCodeUrl}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  const handleShareTelegram = async () => {
    if (!shopData?.qrCodeUrl) return;

    try {
      const message = `Check out my shop: ${shopData.name}\nOwner: ${shopData.owner}\n\nVisit: ${shopData.qrCodeUrl}`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shopData.qrCodeUrl)}&text=${encodeURIComponent(message)}`;
      window.open(telegramUrl, '_blank');
    } catch (error) {
      console.error('Error opening Telegram:', error);
    }
  };

  const handleDownloadQR = async () => {
    if (!shopData?.qrCode) return;

    try {
      const link = document.createElement('a');
      link.href = shopData.qrCode;
      link.download = `${shopData.name || 'shop'}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('shopId');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('shopName');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('publicAccessToken');
    dispatch(setUser(null));
    navigation?.replace('SignIn');
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
        <p style={{
          fontSize: '16px',
          color: '#666',
          textAlign: 'center',
        }}>Loading shop details...</p>
      </div>
    );
  }

  if (!shopData) {
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


  return (
    <div
      id="homepage-container"
      data-testid="homepage-loaded"
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}
    >

      {/* Header with Menu and Shop Information - Fixed */}
      <div style={{
        backgroundColor: '#6C63FF',
        padding: '20px',
        paddingTop: '15px',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flexShrink: 0,
      }}>
        {/* Logged In User - Top Left Corner */}
        {user?.email && (
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            zIndex: 1000,
          }}>
            <div style={{
              padding: '8px 15px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{
                fontSize: '12px',
                color: '#fff',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}>
                👤 <strong>{user.email}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Menu Icon Button - Top Right Corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            zIndex: 9998,
          }}
          aria-label="Menu"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ width: '25px', height: '3px', backgroundColor: '#fff', borderRadius: '2px' }}></div>
            <div style={{ width: '25px', height: '3px', backgroundColor: '#fff', borderRadius: '2px' }}></div>
            <div style={{ width: '25px', height: '3px', backgroundColor: '#fff', borderRadius: '2px' }}></div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 9999,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => {
                setShowMenu(false);
                navigation?.navigate('ManageShopScreen');
              }}
              style={{
                width: '100%',
                padding: '15px 20px',
                backgroundColor: '#fff',
                border: 'none',
                borderBottom: '1px solid #eee',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <span style={{ fontSize: '18px' }}>🏪</span>
              Manage Shop
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                navigation?.navigate('ManageUsersScreen');
              }}
              style={{
                width: '100%',
                padding: '15px 20px',
                backgroundColor: '#fff',
                border: 'none',
                borderBottom: '1px solid #eee',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <span style={{ fontSize: '18px' }}>👥</span>
              Manage Users
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                handleLogout();
              }}
              style={{
                width: '100%',
                padding: '15px 20px',
                backgroundColor: '#fff',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <span style={{ fontSize: '18px' }}>🚪</span>
              Logout
            </button>
          </div>
        )}

        {/* Shop Information - All Details in Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
            margin: 0,
            marginBottom: '15px',
            textAlign: 'center',
          }}>{shopData.name || 'My Shop'}</h1>


          {/* Shop Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            fontSize: '13px',
            color: '#f0f0f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontWeight: '600' }}>👤 Owner:</span>
              <span>{shopData.owner || 'N/A'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontWeight: '600' }}>📧 Email:</span>
              <span style={{ wordBreak: 'break-all' }}>{shopData.email || 'N/A'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontWeight: '600' }}>📍 Address:</span>
              <span>{shopData.address || 'N/A'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontWeight: '600' }}>📱 Mobile:</span>
              <span>+{shopData.mobileCountryCode} {shopData.mobileNumber}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              gridColumn: 'span 2',
              fontSize: '12px',
              opacity: 0.8,
            }}>
              <span style={{ fontWeight: '600' }}>🆔 Shop ID:</span>
              <span style={{ fontFamily: 'monospace' }}>{shopData.id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
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
                <select
                  value={catalogForm.category}
                  onChange={(e) => setCatalogForm({ ...catalogForm, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select Category</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                  Unit *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={catalogForm.unit}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCatalogForm({ ...catalogForm, unit: value });
                      setUnitSearch(value);
                      setShowUnitDropdown(true);
                    }}
                    onFocus={() => setShowUnitDropdown(true)}
                    placeholder="Type to search or enter custom unit"
                    style={{
                      width: '100%',
                      padding: '8px',
                      paddingRight: '30px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                  {catalogForm.unit && (
                    <button
                      onClick={() => {
                        setCatalogForm({ ...catalogForm, unit: '' });
                        setUnitSearch('');
                      }}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#999',
                      }}
                    >
                      ×
                    </button>
                  )}
                  {showUnitDropdown && filteredUnits.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderTop: 'none',
                      borderRadius: '0 0 4px 4px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}>
                      {filteredUnits.map((unit) => (
                        <div
                          key={unit}
                          onClick={() => {
                            setCatalogForm({ ...catalogForm, unit });
                            setShowUnitDropdown(false);
                            setUnitSearch('');
                          }}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            backgroundColor: catalogForm.unit === unit ? '#f0f0f0' : '#fff',
                            borderBottom: '1px solid #f0f0f0',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = catalogForm.unit === unit ? '#f0f0f0' : '#fff'}
                        >
                          {unit}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                  Common: Kg, Piece, Liter, Dozen | Custom: Nag, Bundle, etc.
                </div>
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
              onClick={handleDownloadQR}
              style={{
                backgroundColor: '#FF6B6B',
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
              📥 Download
            </button>

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
    </div>
  );
}


