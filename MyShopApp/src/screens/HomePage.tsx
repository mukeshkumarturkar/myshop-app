import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking, Share, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { apiClient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('🔴 HomePage.tsx: Module loaded');

export default function HomePage({ route, navigation }: any) {
  console.log('🔴 HomePage: Rendering HomePage component');

  const dispatch = useDispatch();
  const [shopData, setShopData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    }
  }, [route?.params]);

  const loadShopData = async () => {
    try {
      // First check if we got shop data from params
      if (route?.params?.shop) {
        return; // Already handled in useEffect above
      }

      // Otherwise, try to load from AsyncStorage
      const shopId = await AsyncStorage.getItem('shopId');
      console.log('🔴 HomePage: Loaded shopId from storage:', shopId);

      if (shopId) {
        console.log('🔴 HomePage: Fetching shop details for ID:', shopId);
        const shop = await apiClient.getShop(shopId);
        console.log('🔴 HomePage: Fetched shop details:', shop);
        setShopData(shop);
      } else {
        console.log('🔴 HomePage: No shopId found');
      }
    } catch (error) {
      console.error('🔴 HomePage: Error loading shop data:', error);
      Alert.alert('Error', 'Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleShareQR = async () => {
    if (!shopData?.qrCodeUrl) {
      Alert.alert('Error', 'QR code URL not available');
      return;
    }

    try {
      const message = `Check out my shop: ${shopData.name}\nOwner: ${shopData.owner}\n\nScan QR code or visit: ${shopData.qrCodeUrl}`;

      await Share.share({
        message: message,
        title: `${shopData.name} - Shop Menu`,
        url: shopData.qrCodeUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareWhatsApp = async () => {
    if (!shopData?.qrCodeUrl) {
      Alert.alert('Error', 'QR code URL not available');
      return;
    }

    try {
      const message = `Check out my shop: ${shopData.name}\nOwner: ${shopData.owner}\n\nVisit: ${shopData.qrCodeUrl}`;
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert('Error', 'Failed to open WhatsApp');
    }
  };

  const handleShareTelegram = async () => {
    if (!shopData?.qrCodeUrl) {
      Alert.alert('Error', 'QR code URL not available');
      return;
    }

    try {
      const message = `Check out my shop: ${shopData.name}\nOwner: ${shopData.owner}\n\nVisit: ${shopData.qrCodeUrl}`;
      const telegramUrl = `tg://msg?text=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(telegramUrl);
      if (canOpen) {
        await Linking.openURL(telegramUrl);
      } else {
        Alert.alert('Telegram not installed', 'Please install Telegram to share');
      }
    } catch (error) {
      console.error('Error opening Telegram:', error);
      Alert.alert('Error', 'Failed to open Telegram');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('shopId');
    await AsyncStorage.removeItem('authToken');
    dispatch(setUser(null));
    navigation?.replace('SignIn');
  };

  console.log('🔴 HomePage: About to return JSX');

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading shop details...</Text>
      </View>
    );
  }

  if (!shopData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No shop data available</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation?.replace('SignIn')}>
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{shopData.name || 'My Shop'}</Text>
        <Text style={styles.headerSubtitle}>Owner: {shopData.owner || 'N/A'}</Text>
      </View>

      {/* Shop Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shop Information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shop Name:</Text>
          <Text style={styles.detailValue}>{shopData.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Owner:</Text>
          <Text style={styles.detailValue}>{shopData.owner}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{shopData.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{shopData.email}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mobile:</Text>
          <Text style={styles.detailValue}>
            +{shopData.mobileCountryCode} {shopData.mobileNumber}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shop ID:</Text>
          <Text style={styles.detailValue}>{shopData.id}</Text>
        </View>
      </View>

      {/* QR Code Card */}
      {shopData.qrCode && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shop QR Code</Text>

          <View style={styles.qrContainer}>
            <Image
              source={{ uri: shopData.qrCode }}
              style={styles.qrCode}
              resizeMode="contain"
            />
          </View>

          {shopData.qrCodeUrl && (
            <Text style={styles.qrUrl}>{shopData.qrCodeUrl}</Text>
          )}

          {/* Share Buttons */}
          <View style={styles.shareButtonsContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareQR}>
              <Text style={styles.shareButtonText}>📤 Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shareButton, styles.whatsappButton]} onPress={handleShareWhatsApp}>
              <Text style={styles.shareButtonText}>💬 WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shareButton, styles.telegramButton]} onPress={handleShareTelegram}>
              <Text style={styles.shareButtonText}>✈️ Telegram</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation?.navigate('ManageShop')}
        >
          <Text style={styles.buttonText}>Manage Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Debug Info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>✓ Shop loaded successfully</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#6C63FF',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrCode: {
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  qrUrl: {
    fontSize: 12,
    color: '#6C63FF',
    textAlign: 'center',
    marginBottom: 15,
  },
  shareButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  telegramButton: {
    backgroundColor: '#0088cc',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 15,
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#6C63FF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#6C63FF',
  },
  debugContainer: {
    padding: 20,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
  },
});
        <div>Render #{renderCount}</div>
        <div>Email: {email.substring(0, 10)}...</div>
        <div>Loading: {loading ? 'YES' : 'NO'}</div>
        <div>Time: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

