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
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../services/api';
import { setError } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageUsersScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [mobileCountryCode, setMobileCountryCode] = useState('91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // In a real app, fetch existing users from backend
    // For now, we'll just show the current user
    if (auth.user) {
      setUsers([
        {
          id: auth.user.uid,
          email: auth.user.email,
          name: auth.user.displayName,
          isOwner: true,
        },
      ]);
    }
  }, [auth.user]);

  const validateForm = () => {
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      Alert.alert('Validation Error', 'Valid mobile number (10 digits) is required');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;
    if (!auth.user?.uid) {
      Alert.alert('Error', 'Shop ID is missing');
      return;
    }

    setLoading(true);
    try {
      console.log('🔴 ManageUsers: Creating new user account...');

      // Create new user account via API
      const userData = await apiClient.createUser(
        auth.user.uid,
        password,
        confirmPassword
      );

      console.log('🔴 ManageUsers: User account created successfully');

      // Reset form
      setMobileNumber('');
      setPassword('');
      setConfirmPassword('');
      setShowAddUser(false);

      // Add new user to list
      const newUser = {
        id: userData.userId || `${mobileCountryCode}${mobileNumber}`,
        mobile: `${mobileCountryCode}${mobileNumber}`,
        isOwner: false,
      };
      setUsers([...users, newUser]);

      Alert.alert('Success', `User account created successfully!\n\nUserId: ${mobileCountryCode}${mobileNumber}`);
    } catch (error: any) {
      console.error('User creation error:', error);
      const errorMessage = error.response?.data?.details || error.response?.data?.message || error.message || 'User creation failed';
      dispatch(setError(errorMessage));
      Alert.alert('User Creation Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: any) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.email || item.mobile}</Text>
        {item.name && <Text style={styles.userDetail}>{item.name}</Text>}
        {item.isOwner && <Text style={styles.ownerBadge}>👑 Owner</Text>}
      </View>
      {!item.isOwner && (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Remove User',
              'Are you sure you want to remove this user?',
              [
                { text: 'Cancel' },
                {
                  text: 'Remove',
                  onPress: () => {
                    setUsers(users.filter((u) => u.id !== item.id));
                    Alert.alert('Success', 'User removed');
                  },
                  style: 'destructive',
                },
              ]
            )
          }
        >
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Shop Users</Text>
          <Text style={styles.subtitle}>Add team members to your shop</Text>
        </View>

        <View style={styles.content}>
          {/* Users List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Authorized Users ({users.length})</Text>
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          </View>

          {/* Add User Section */}
          {!showAddUser ? (
            <TouchableOpacity
              style={styles.addUserButton}
              onPress={() => setShowAddUser(true)}
            >
              <Text style={styles.addUserButtonText}>+ Add New User</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addUserForm}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Create New User Account</Text>
                <TouchableOpacity onPress={() => setShowAddUser(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Mobile Number *</Text>
                <View style={styles.mobileInputContainer}>
                  <TextInput
                    style={[styles.input, styles.countryCode]}
                    placeholder="+91"
                    value={mobileCountryCode}
                    onChangeText={setMobileCountryCode}
                    maxLength={3}
                    editable={!loading}
                    keyboardType="number-pad"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={[styles.input, styles.mobileInput]}
                    placeholder="10-digit mobile number"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    keyboardType="phone-pad"
                    editable={!loading}
                    maxLength={10}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChangeText={setPassword}
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
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!loading}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.passwordNote}>
                <Text style={styles.passwordNoteText}>
                  💡 User can login with their mobile number and password
                </Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.cancelButton, loading && styles.disabledButton]}
                  onPress={() => setShowAddUser(false)}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.createButton, loading && styles.disabledButton]}
                  onPress={handleAddUser}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.createButtonText}>Create User</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
    padding: 5,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  userDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  ownerBadge: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  removeButton: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addUserButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addUserButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addUserForm: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginTop: 15,
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
    backgroundColor: '#fff',
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
  buttonGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    flex: 0.4,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    flex: 0.6,
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ManageUsersScreen;

