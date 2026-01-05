import React, { useState } from 'react';
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
} from 'react-native';
import { useDispatch } from 'react-redux';
import { apiClient } from '../services/api';
import { setCurrentShop } from '../store/shopSlice';
import { Shop } from '../types';

const EditShopScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch();
  const shop: Shop = route.params?.shop;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: shop?.name || '',
    owner: shop?.owner || '',
    address: shop?.address || '',
    email: shop?.email || '',
    mobileCountryCode: shop?.mobile_country_code || '91',
    mobileNumber: shop?.mobile_number || '',
    primaryColor: shop?.theme?.colors?.primary || '#6C63FF',
    secondaryColor: shop?.theme?.colors?.secondary || '#FFFFFF',
    lookAndFeel: shop?.theme?.lookAndFeel || 'Modern',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Shop name is required');
      return false;
    }
    if (!formData.owner.trim()) {
      Alert.alert('Validation Error', 'Owner name is required');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updatedData = {
        name: formData.name,
        owner: formData.owner,
        address: formData.address,
        email: formData.email,
        mobile_country_code: formData.mobileCountryCode,
        mobile_number: formData.mobileNumber,
        theme: {
          colors: {
            primary: formData.primaryColor,
            secondary: formData.secondaryColor,
          },
          lookAndFeel: formData.lookAndFeel,
          menu: shop?.theme?.menu || 'Menu',
          logo: shop?.theme?.logo || 'default-logo.png',
        },
      };

      const response = await apiClient.updateShop(shop._id, updatedData);
      dispatch(setCurrentShop(response.data));
      Alert.alert('Success', 'Shop details updated successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error updating shop:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update shop';
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
          <Text style={styles.title}>Edit Shop Details</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Shop Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter shop name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Owner Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter owner name"
              value={formData.owner}
              onChangeText={(value) => handleInputChange('owner', value)}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Shop Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter full shop address"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.mobileInputContainer}>
              <TextInput
                style={[styles.input, styles.countryCode]}
                placeholder="+91"
                value={formData.mobileCountryCode}
                onChangeText={(value) => handleInputChange('mobileCountryCode', value)}
                maxLength={3}
                editable={!loading}
              />
              <TextInput
                style={[styles.input, styles.mobileInput]}
                placeholder="Mobile number"
                value={formData.mobileNumber}
                onChangeText={(value) => handleInputChange('mobileNumber', value)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Theme Settings</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Look & Feel</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Modern, Traditional, Elegant"
              value={formData.lookAndFeel}
              onChangeText={(value) => handleInputChange('lookAndFeel', value)}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Primary Color</Text>
            <View style={styles.colorInputContainer}>
              <TextInput
                style={[styles.input, styles.colorInput]}
                placeholder="#6C63FF"
                value={formData.primaryColor}
                onChangeText={(value) => handleInputChange('primaryColor', value)}
                editable={!loading}
              />
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: formData.primaryColor || '#6C63FF' },
                ]}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Secondary Color</Text>
            <View style={styles.colorInputContainer}>
              <TextInput
                style={[styles.input, styles.colorInput]}
                placeholder="#FFFFFF"
                value={formData.secondaryColor}
                onChangeText={(value) => handleInputChange('secondaryColor', value)}
                editable={!loading}
              />
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: formData.secondaryColor || '#FFFFFF' },
                ]}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
  mobileInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCode: {
    flex: 0.25,
  },
  mobileInput: {
    flex: 0.75,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  colorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorInput: {
    flex: 1,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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

export default EditShopScreen;

