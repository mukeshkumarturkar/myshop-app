import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';
import { addCatalog, updateCatalog } from '../store/catalogSlice';
import { Catalog, Availability, Stock, Price } from '../types';

const CatalogDetailScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch();
  const catalog = route.params?.catalog;
  const isEditMode = !!catalog;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: catalog?.name || '',
    description: catalog?.description || '',
    category: catalog?.category || '',
    unit: catalog?.unit || 'Per Piece',
    price: catalog?.price?.value || '',
    currency: catalog?.price?.currency || 'Rupees',
    discountPercentage: catalog?.price?.discountPercentage?.toString() || '0',
    isAvailable: catalog?.availability?.isAvailable ?? true,
    startTime: catalog?.availability?.startTime || '09:00',
    endTime: catalog?.availability?.endTime || '22:00',
    quantity: catalog?.stock?.quantity?.toString() || '0',
    reorderLevel: catalog?.stock?.reorderLevel?.toString() || '5',
    status: catalog?.status || 'ACTIVE',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Item name is required');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Validation Error', 'Category is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Validation Error', 'Valid price is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        Alert.alert('Error', 'Shop ID not found');
        return;
      }

      const discountedPrice =
        parseFloat(formData.price) *
        (1 - (parseFloat(formData.discountPercentage) || 0) / 100);

      const catalogData: any = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        unit: formData.unit,
        shopId: shopId,
        price: {
          currency: formData.currency,
          value: parseFloat(formData.price),
          discountPercentage: parseFloat(formData.discountPercentage) || 0,
          discountedPrice: parseFloat(discountedPrice.toFixed(2)),
        },
        availability: {
          isAvailable: formData.isAvailable,
          startTime: formData.startTime,
          endTime: formData.endTime,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          seasonalAvailable: false,
          season: 'All Season',
        },
        stock: {
          quantity: parseInt(formData.quantity) || 0,
          unit: formData.unit,
          reorderLevel: parseInt(formData.reorderLevel) || 5,
        },
        status: formData.status,
      };

      if (isEditMode) {
        // Update existing catalog
        const response = await apiClient.updateCatalog(catalog._id, catalogData);
        dispatch(updateCatalog(response.data));
        Alert.alert('Success', 'Catalog item updated successfully');
      } else {
        // Create new catalog
        const response = await apiClient.createCatalog(catalogData);
        dispatch(addCatalog(response.data));
        Alert.alert('Success', 'Catalog item created successfully');
      }

      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving catalog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save catalog';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditMode ? 'Edit Catalog Item' : 'Add New Item'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Item Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter item name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              editable={!loading}
            />
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter item description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Pizzas, Beverages, Desserts"
              value={formData.category}
              onChangeText={(value) => handleInputChange('category', value)}
              editable={!loading}
            />
          </View>

          {/* Unit */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Unit</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Per Piece, Per Kg"
              value={formData.unit}
              onChangeText={(value) => handleInputChange('unit', value)}
              editable={!loading}
            />
          </View>

          {/* Price Section */}
          <Text style={styles.sectionTitle}>Pricing</Text>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Currency</Text>
              <TextInput
                style={styles.input}
                placeholder="Rupees"
                value={formData.currency}
                onChangeText={(value) => handleInputChange('currency', value)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Discount */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Discount %</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.discountPercentage}
              onChangeText={(value) => handleInputChange('discountPercentage', value)}
              keyboardType="decimal-pad"
              editable={!loading}
            />
          </View>

          {/* Availability Section */}
          <Text style={styles.sectionTitle}>Availability</Text>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Available</Text>
            <Switch
              value={formData.isAvailable}
              onValueChange={(value) => handleInputChange('isAvailable', value)}
              disabled={loading}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:mm"
                value={formData.startTime}
                onChangeText={(value) => handleInputChange('startTime', value)}
                editable={!loading}
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>End Time</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:mm"
                value={formData.endTime}
                onChangeText={(value) => handleInputChange('endTime', value)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Stock Section */}
          <Text style={styles.sectionTitle}>Stock Management</Text>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
                keyboardType="number-pad"
                editable={!loading}
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Reorder Level</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.reorderLevel}
                onChangeText={(value) => handleInputChange('reorderLevel', value)}
                keyboardType="number-pad"
                editable={!loading}
              />
            </View>
          </View>

          {/* Status */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusPicker}>
              {['ACTIVE', 'INACTIVE', 'DISCONTINUED'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    formData.status === status && styles.statusOptionSelected,
                  ]}
                  onPress={() => handleInputChange('status', status)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      formData.status === status && styles.statusOptionTextSelected,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditMode ? 'Update Item' : 'Create Item'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 20,
  },
  statusPicker: {
    flexDirection: 'row',
    gap: 10,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  statusOptionSelected: {
    borderColor: '#6C63FF',
    backgroundColor: '#f0edff',
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  statusOptionTextSelected: {
    color: '#6C63FF',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CatalogDetailScreen;

