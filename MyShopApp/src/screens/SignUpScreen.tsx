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
import { setUser, setError, setLoading as setLoadingAction } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [signUpStep, setSignUpStep] = useState<'shop' | 'user'>('shop');
  const [shopId, setShopId] = useState<string | null>(null);
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

  const validateShopForm = () => {
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
    if (!formData.address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
      Alert.alert('Validation Error', 'Valid mobile number (10 digits) is required');
      return false;
    }
    return true;
  };

  const validateUserForm = () => {
    if (formData.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleCreateShop = async () => {
    if (!validateShopForm()) return;

    setLoading(true);
    try {
      console.log('🔴 SignUp: Starting shop creation...');

      // 1. Create shop via API
      const shopData = await apiClient.createShop({
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

      const newShopId = shopData._id;
      console.log('🔴 SignUp: Shop created successfully:', newShopId);

      setShopId(newShopId);
      setSignUpStep('user');

      Alert.alert('Success', 'Shop created! Now please set up your user account.');
    } catch (error: any) {
      console.error('Shop creation error:', error);
      const errorMessage = error.response?.data?.details || error.response?.data?.message || error.message || 'Shop creation failed';
      dispatch(setError(errorMessage));
      Alert.alert('Shop Creation Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!validateUserForm()) return;
    if (!shopId) {
      Alert.alert('Error', 'Shop ID is missing. Please try again.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔴 SignUp: Creating user account for shop:', shopId);

      // Create user account via API
      const userData = await apiClient.createUser(
        shopId,
        formData.password,
        formData.confirmPassword
      );

      console.log('🔴 SignUp: User account created successfully');

      // Save shop ID, shop name and user data
      await AsyncStorage.setItem('shopId', shopId);
      await AsyncStorage.setItem('shopName', formData.shopName);
      await AsyncStorage.setItem('ownerName', formData.ownerName);
      await AsyncStorage.setItem('email', formData.email);
      await AsyncStorage.setItem('mobileNumber', `${formData.mobileCountryCode}${formData.mobileNumber}`);

      // Update Redux state
      dispatch(
        setUser({
          uid: shopId,
          email: formData.email,
          displayName: formData.ownerName,
          shopName: formData.shopName,
        })
      );

      Alert.alert('Success', 'Shop and user account created successfully! Please sign in to continue.', [
        {
          text: 'OK',
          onPress: () => {
            setSignUpStep('shop');
            setShopId(null);
            setFormData({
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
            navigation.replace('SignIn');
          },
        },
      ]);
    } catch (error: any) {
      console.error('User creation error:', error);
      const errorMessage = error.response?.data?.details || error.response?.data?.message || error.message || 'User account creation failed';
      dispatch(setError(errorMessage));
      Alert.alert('User Account Creation Failed', errorMessage);
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
          <Text style={styles.subtitle}>
            {signUpStep === 'shop' ? 'Step 1: Shop Details' : 'Step 2: Create Account'}
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, signUpStep === 'shop' && styles.activeProgressDot]} />
          <View style={styles.progressLine} />
          <View style={[styles.progressDot, signUpStep === 'user' && styles.activeProgressDot]} />
        </View>

        <View style={styles.form}>
          {signUpStep === 'shop' ? (
            <>
              {/* SHOP DETAILS FORM */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Shop Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter shop name"
                  value={formData.shopName}
                  onChangeText={(value) => handleInputChange('shopName', value)}
                  editable={!loading}
                  placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
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
                  autoCapitalize="none"
                  placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
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
                    keyboardType="number-pad"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={[styles.input, styles.mobileInput]}
                    placeholder="10-digit mobile number"
                    value={formData.mobileNumber}
                    onChangeText={(value) => handleInputChange('mobileNumber', value)}
                    keyboardType="phone-pad"
                    editable={!loading}
                    maxLength={10}
                    placeholderTextColor="#999"
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
                    placeholderTextColor="#999"
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
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.signUpButton, loading && styles.disabledButton]}
                onPress={handleCreateShop}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>Continue to Account Setup</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* USER ACCOUNT FORM */}
              <View style={styles.shopInfoBox}>
                <Text style={styles.shopInfoLabel}>Shop Details</Text>
                <Text style={styles.shopInfoText}>Shop: <Text style={styles.bold}>{formData.shopName}</Text></Text>
                <Text style={styles.shopInfoText}>Owner: <Text style={styles.bold}>{formData.ownerName}</Text></Text>
                <Text style={styles.shopInfoText}>Email: <Text style={styles.bold}>{formData.email}</Text></Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  editable={!loading}
                  placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.passwordNote}>
                <Text style={styles.passwordNoteText}>
                  💡 Password will be used for shop owner login with mobile number: {formData.mobileCountryCode}{formData.mobileNumber}
                </Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.secondaryButton, loading && styles.disabledButton]}
                  onPress={() => setSignUpStep('shop')}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>← Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.signUpButton, loading && styles.disabledButton]}
                  onPress={handleCreateUser}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {signUpStep === 'shop' && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  activeProgressDot: {
    backgroundColor: '#6C63FF',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
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
  shopInfoBox: {
    backgroundColor: '#e8eaff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  shopInfoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  shopInfoText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 5,
  },
  bold: {
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  passwordNote: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  passwordNoteText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
  signUpButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryButton: {
    flex: 0.4,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 15,
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

