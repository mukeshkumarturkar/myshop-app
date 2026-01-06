import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';
import { setCatalogsByShop, setLoading } from '../store/catalogSlice';
import { RootState } from '../store';

const CatalogListScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const catalogs = useSelector((state: RootState) => state.catalog.filteredByShop);
  const isLoading = useSelector((state: RootState) => state.catalog.isLoading);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    dispatch(setLoading(true));
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        alert('Shop ID not found');
        return;
      }
      const response = await apiClient.getCatalogsByShopId(shopId);
      dispatch(setCatalogsByShop(response.data || []));
    } catch (error: any) {
      console.error('Error loading catalogs:', error);
      alert('Failed to load catalog items');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filteredCatalogs = catalogs.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCatalog = async (catalogId: string) => {
    if (window.confirm('Are you sure you want to delete this catalog item?')) {
      try {
        await apiClient.deleteCatalog(catalogId);
        alert('Catalog item deleted');
        loadCatalogs();
      } catch (error: any) {
        alert('Failed to delete catalog item');
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
        }}>
          Catalog Items
        </h1>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search catalogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={() => navigation?.navigate?.('CatalogDetail')}
            style={{
              backgroundColor: '#6C63FF',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Add New Item
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading catalogs...</p>
          </div>
        ) : filteredCatalogs && filteredCatalogs.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {filteredCatalogs.map((catalog: any) => (
              <div
                key={catalog._id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  padding: '15px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{catalog.name}</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '12px' }}>{catalog.category}</p>
                <p style={{ margin: '0 0 10px 0', color: '#999', fontSize: '13px' }}>{catalog.description}</p>
                <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold', color: '#6C63FF' }}>
                    ₹{catalog.price?.value}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    backgroundColor: catalog.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                    color: catalog.status === 'ACTIVE' ? '#155724' : '#721c24',
                  }}>
                    {catalog.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => navigation?.navigate?.('CatalogDetail', { catalog })}
                    style={{
                      flex: 1,
                      backgroundColor: '#f39c12',
                      color: '#fff',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCatalog(catalog._id)}
                    style={{
                      flex: 1,
                      backgroundColor: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#fff',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
          }}>
            <p style={{ color: '#999' }}>No catalog items found</p>
            <button
              onClick={() => navigation?.navigate?.('CatalogDetail')}
              style={{
                backgroundColor: '#6C63FF',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Create First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogListScreen;

