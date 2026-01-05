import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Share,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';
import { setCurrentShop } from '../store/shopSlice';
import { RootState } from '../store';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const ManageShopScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const currentShop = useSelector((state: RootState) => state.shop.currentShop);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [generatingQR, setGeneratingQR] = useState(false);

  useEffect(() => {
    if (isFocused) {
      loadShopData();
    }
  }, [isFocused]);

  const loadShopData = async () => {
    setLoading(true);
    try {
      const shopId = await AsyncStorage.getItem('shopId');
      if (!shopId) {
        Alert.alert('Error', 'Shop ID not found');
        return;
      }

      const response = await apiClient.getShopById(shopId);
      dispatch(setCurrentShop(response.data));

      // Try to load QR code
      if (response.data.qr_code) {
        setQrCode(response.data.qr_code);
      }
    } catch (error: any) {
      console.error('Error loading shop:', error);
      Alert.alert('Error', 'Failed to load shop data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!currentShop) {
      Alert.alert('Error', 'Shop data not found');
      return;
    }

    setGeneratingQR(true);
    try {
      const response = await apiClient.generateQRCode(currentShop._id);
      setQrCode(response.data.qrCode);
      Alert.alert('Success', 'QR code generated successfully');
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      Alert.alert('Error', 'Failed to generate QR code');
    } finally {
      setGeneratingQR(false);
    }
  };

  const handleShareQR = async () => {
    if (!qrCode || !currentShop) {
      Alert.alert('Error', 'QR code not available');
      return;
    }

    try {
      // Save QR code to temporary file
      const fileName = `${currentShop._id}-qr.png`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Convert base64 to file if needed
      if (qrCode.startsWith('data:')) {
        const base64Data = qrCode.split(',')[1];
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/png',
        dialogTitle: `Share ${currentShop.name} QR Code`,
      });
    } catch (error: any) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!currentShop) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No shop data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop Management</Text>
      </View>

      {/* Shop Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shop Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shop Name:</Text>
          <Text style={styles.detailValue}>{currentShop.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Owner:</Text>
          <Text style={styles.detailValue}>{currentShop.owner}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{currentShop.email || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{currentShop.address}</Text>
        </View>

        {currentShop.mobile_number && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile:</Text>
            <Text style={styles.detailValue}>
              +{currentShop.mobile_country_code} {currentShop.mobile_number}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditShop', { shop: currentShop })}
        >
          <Text style={styles.editButtonText}>Edit Shop Details</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>QR Code</Text>

        {qrCode ? (
          <>
            <View style={styles.qrContainer}>
              <Image
                source={{ uri: qrCode }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.qrInfoText}>
              Customers can scan this QR code to view your menu
            </Text>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareQR}
            >
              <Text style={styles.shareButtonText}>Share QR Code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.noQrText}>No QR code generated yet</Text>
            <TouchableOpacity
              style={[styles.generateButton, generatingQR && styles.disabledButton]}
              onPress={handleGenerateQR}
              disabled={generatingQR}
            >
              {generatingQR ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.generateButtonText}>Generate QR Code</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Theme Card */}
      {currentShop.theme && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Theme Settings</Text>

          {currentShop.theme.colors && (
            <View style={styles.colorPreview}>
              <Text style={styles.colorLabel}>Primary Color:</Text>
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: currentShop.theme.colors.primary },
                ]}
              />
            </View>
          )}

          {currentShop.theme.lookAndFeel && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Style:</Text>
              <Text style={styles.detailValue}>{currentShop.theme.lookAndFeel}</Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.catalogButton]}
          onPress={() => navigation.navigate('CatalogList')}
        >
          <Text style={styles.actionButtonText}>Manage Catalog</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.refreshButton]}
          onPress={loadShopData}
        >
          <Text style={styles.actionButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
    backgroundColor: '#f5f5f5',
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
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 0.4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 0.6,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 15,
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  qrInfoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  noQrText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  shareButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  editButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 10,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  catalogButton: {
    backgroundColor: '#3498db',
  },
  refreshButton: {
    backgroundColor: '#95a5a6',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 20,
  },
});

export default ManageShopScreen;

