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

const SignInScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      console.log('🔴 SignIn: Attempting email/password authentication...');

      // Call API to authenticate using email
      const response = await apiClient.authenticate(email, password);
      console.log('🔴 SignIn: Authentication successful');

      // Save auth token
      if (response.oauth_token) {
        await AsyncStorage.setItem('authToken', response.oauth_token);
      }

      // Save user and shop data
      if (response.shopId) await AsyncStorage.setItem('shopId', response.shopId);
      if (response.shop_name) await AsyncStorage.setItem('shopName', response.shop_name);
      if (response.owner_name) await AsyncStorage.setItem('ownerName', response.owner_name);
      if (response.email) await AsyncStorage.setItem('email', response.email);
      if (response.userId) await AsyncStorage.setItem('userId', response.userId);

      // Update Redux state
      dispatch(
        setUser({
          uid: response.userId || response.shopId,
          email: response.email || email,
          displayName: response.owner_name || 'Shop Owner',
          shopName: response.shop_name,
        })
      );

      Alert.alert('Success', 'Signed in successfully!');
      navigation.replace('MainApp');
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Sign in failed';
      dispatch(setError(errorMessage));
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      console.log('🔴 SignIn: Attempting phone authentication...');

      // Authenticate using phone number as userId
      const userId = `${countryCode}${phoneNumber}`;

      // For now, show a message that OTP is not yet implemented
      // In production, this would trigger an OTP send
      Alert.alert(
        'Feature Coming Soon',
        'Phone OTP authentication is currently being integrated with Firebase/OTP service.\n\nFor now, please use Email & Password login.\n\nUserId format: ' + userId
      );
      setLoading(false);
    } catch (error: any) {
      console.error('Phone auth error:', error);
      Alert.alert('Error', error.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.alert(
      'Google Sign-In',
      'Google authentication will be configured with Google Cloud Console and Firebase.\n\nFor now, please use Email & Password login.'
    );
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length < 6) {
      Alert.alert('Validation Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      console.log('🔴 SignIn: Verifying OTP...');
      Alert.alert('Feature Coming Soon', 'OTP verification will be implemented soon');
      setLoading(false);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert('Verification Failed', error.message);
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to manage your shop</Text>
        </View>

        <View style={styles.methodSelector}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              signInMethod === 'email' && styles.activeMethodButton,
            ]}
            onPress={() => {
              setSignInMethod('email');
              setOtpSent(false);
            }}
          >
            <Text
              style={[
                styles.methodButtonText,
                signInMethod === 'email' && styles.activeMethodButtonText,
              ]}
            >
              📧 Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodButton,
              signInMethod === 'phone' && styles.activeMethodButton,
            ]}
            onPress={() => {
              setSignInMethod('phone');
              setOtpSent(false);
            }}
          >
            <Text
              style={[
                styles.methodButtonText,
                signInMethod === 'phone' && styles.activeMethodButtonText,
              ]}
            >
              📱 Phone
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {signInMethod === 'email' ? (
            <>
              {/* EMAIL SIGN IN */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable={!loading}
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity
                style={[styles.signInButton, loading && styles.disabledButton]}
                onPress={handleEmailSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* PHONE OTP SIGN IN */}
              {!otpSent ? (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <View style={styles.phoneInputContainer}>
                      <View style={styles.countryCodeBox}>
                        <Text style={styles.countryCode}>+{countryCode}</Text>
                      </View>
                      <TextInput
                        style={styles.phoneInput}
                        placeholder="10-digit mobile number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        editable={!loading}
                        maxLength={10}
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.signInButton, loading && styles.disabledButton]}
                    onPress={handlePhoneSignIn}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.signInButtonText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.otpInfo}>
                    <Text style={styles.otpInfoText}>
                      OTP sent to +{countryCode}{phoneNumber}
                    </Text>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Enter OTP</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="6-digit OTP"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      editable={!loading}
                      maxLength={6}
                      placeholderTextColor="#999"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.signInButton, loading && styles.disabledButton]}
                    onPress={handleVerifyOTP}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.signInButtonText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setOtpSent(false)}>
                    <Text style={styles.changePhoneText}>← Use different number</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Text style={styles.googleButtonText}>🔐 Sign In with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Not Registered? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signUpPrompt}>
            <Text style={styles.signUpPromptText}>
              Don't have a shop yet? Create one now and start managing your menu!
            </Text>
          </View>
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
  methodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeMethodButton: {
    borderColor: '#6C63FF',
    backgroundColor: '#f0edff',
  },
  methodButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  activeMethodButtonText: {
    color: '#6C63FF',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryCodeBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  otpInfo: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#28a745',
  },
  otpInfoText: {
    fontSize: 13,
    color: '#155724',
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changePhoneText: {
    color: '#6C63FF',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    color: '#999',
    fontSize: 12,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
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
  signUpPrompt: {
    backgroundColor: '#e8eaff',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  signUpPromptText: {
    fontSize: 12,
    color: '#6C63FF',
    lineHeight: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SignInScreen;

