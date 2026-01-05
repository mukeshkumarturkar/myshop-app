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
import { setUser, setError } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    mobileCountryCode: '91',
    mobileNumber: '',
    primaryColor: '#FF6B6B',
    secondaryColor: '#FFFFFF',
    menuDescription: '',
    lookAndFeel: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.shopName.trim()) {
      Alert.alert('Validation Error', 'Shop name is required');
      return false;
    }
    if (!formData.ownerName.trim()) {
      Alert.alert('Validation Error', 'Owner name is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Validation Error', 'Valid email is required');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
      Alert.alert('Validation Error', 'Valid mobile number is required');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('🔴 SignUp: Starting shop creation...');

      // 1. Create shop via API
      const shopResponse = await apiClient.createShop({
        name: formData.shopName,
        address: formData.address,
        owner: formData.ownerName,
        email: formData.email,
        mobile_country_code: formData.mobileCountryCode,
        mobile_number: formData.mobileNumber,
        theme: {
          colors: {
            primary: formData.primaryColor,
            secondary: formData.secondaryColor,
          },
          menu: formData.menuDescription,
          lookAndFeel: formData.lookAndFeel,
          logo: 'default-logo.png',
        },
      });

      const shopId = shopResponse.data._id;
      console.log('🔴 SignUp: Shop created:', shopId);

      // 2. Create user account via API
      console.log('🔴 SignUp: Creating user account...');
      const userResponse = await apiClient.createUser(
        shopId,
        formData.password,
        formData.confirmPassword
      );
      console.log('🔴 SignUp: User account created');

      // 3. Save shop ID and user data
      await AsyncStorage.setItem('shopId', shopId);
      await AsyncStorage.setItem('shopName', formData.shopName);
      await AsyncStorage.setItem('ownerName', formData.ownerName);
      await AsyncStorage.setItem('email', formData.email);

      // 4. Update Redux state
      dispatch(
        setUser({
          uid: shopId,
          email: formData.email,
          displayName: formData.ownerName,
          shopName: formData.shopName,
        })
      );

      Alert.alert('Success', 'Shop created successfully! Please sign in to continue.', [
        {
          text: 'OK',
          onPress: () => navigation.replace('SignIn'),
        },
      ]);
    } catch (error: any) {
      console.error('Sign up error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Sign up failed';
      dispatch(setError(errorMessage));
      Alert.alert('Sign Up Failed', errorMessage);
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
          <Text style={styles.title}>Create Your Shop</Text>
          <Text style={styles.subtitle}>Sign up as a shop owner</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Shop Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter shop name"
              value={formData.shopName}
              onChangeText={(value) => handleInputChange('shopName', value)}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Owner Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.ownerName}
              onChangeText={(value) => handleInputChange('ownerName', value)}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address *</Text>
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
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Shop Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter shop address"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mobile Number *</Text>
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

          <View style={styles.themeSection}>
            <Text style={styles.themeTitle}>Shop Theme (Optional)</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Menu Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Italian pizza, pasta, and desserts"
                value={formData.menuDescription}
                onChangeText={(value) => handleInputChange('menuDescription', value)}
                multiline
                numberOfLines={2}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Look and Feel</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Modern and cozy Italian restaurant"
                value={formData.lookAndFeel}
                onChangeText={(value) => handleInputChange('lookAndFeel', value)}
                editable={!loading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Create Shop</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 5,
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
  themeSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignUpScreen;

