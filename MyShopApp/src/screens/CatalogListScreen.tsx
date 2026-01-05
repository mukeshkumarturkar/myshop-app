import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';
import { setCatalogsByShop, setLoading } from '../store/catalogSlice';
import { RootState } from '../store';
import { Catalog } from '../types';

const CatalogListScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const catalogs = useSelector((state: RootState) => state.catalog.filteredByShop);
  const isLoading = useSelector((state: RootState) => state.catalog.isLoading);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      loadCatalogs();
    }
  }, [isFocused]);

  const loadCatalogs = async () => {
    dispatch(setLoading(true));
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        Alert.alert('Error', 'Shop ID not found');
        return;
      }

      const response = await apiClient.getCatalogsByShopId(shopId);
      dispatch(setCatalogsByShop(response.data || []));
    } catch (error: any) {
      console.error('Error loading catalogs:', error);
      Alert.alert('Error', 'Failed to load catalog items');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCatalogs();
    setRefreshing(false);
  };

  const filteredCatalogs = catalogs.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCatalog = async (catalogId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this catalog item?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await apiClient.deleteCatalog(catalogId);
              Alert.alert('Success', 'Catalog item deleted');
              loadCatalogs();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete catalog item');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderCatalogItem = ({ item }: { item: Catalog }) => (
    <TouchableOpacity
      style={styles.catalogCard}
      onPress={() => navigation.navigate('CatalogDetail', { catalog: item })}
    >
      <View style={styles.catalogHeader}>
        <View style={styles.catalogTitleContainer}>
          <Text style={styles.catalogName}>{item.name}</Text>
          <Text style={styles.catalogCategory}>{item.category}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {item.price.currency === 'Rupees' ? '₹' : item.price.currency}{' '}
            {item.price.value}
          </Text>
          {item.price.discountPercentage > 0 && (
            <Text style={styles.discount}>-{item.price.discountPercentage}%</Text>
          )}
        </View>
      </View>

      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.catalogFooter}>
        <View style={styles.statusBadge}>
          <Text
            style={[
              styles.statusText,
              item.status === 'ACTIVE'
                ? styles.statusActive
                : item.status === 'INACTIVE'
                ? styles.statusInactive
                : styles.statusDiscontinued,
            ]}
          >
            {item.status}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('CatalogDetail', { catalog: item })}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDeleteCatalog(item._id)}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catalog Management</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or category..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading && catalogs.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : filteredCatalogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No catalog items found</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddCatalog')}
          >
            <Text style={styles.addButtonText}>+ Add First Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCatalogs}
          renderItem={renderCatalogItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddCatalog')}
      >
        <Text style={styles.fabButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 80,
  },
  catalogCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  catalogTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  catalogName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  catalogCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  discount: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  catalogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusActive: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusInactive: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusDiscontinued: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
});

export default CatalogListScreen;

