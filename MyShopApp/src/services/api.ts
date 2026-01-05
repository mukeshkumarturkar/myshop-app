import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError } from '../types';

// API Base URL - defaults to soanch.com for production
// Override with EXPO_PUBLIC_API_URL environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.soanch.com/api';

console.log('🔴 API Client: Base URL =', API_BASE_URL);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptors
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - trigger logout
          AsyncStorage.removeItem('authToken');
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async createUser(shopId: string, password: string, confirmPassword: string) {
    return this.client.post('/shops/user', {
      shopId,
      password,
      confirmPassword,
    });
  }

  async authenticate(userId: string, password: string) {
    return this.client.post('/shops/auth', {
      userId,
      password,
    });
  }

  async resetPassword(userId: string, oldPassword: string, newPassword: string, confirmNewPassword: string) {
    return this.client.post('/shops/reset-password', {
      userId,
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
  }

  // Shop endpoints
  async createShop(data: any) {
    return this.client.post('/shops', data);
  }

  async getAllShops() {
    return this.client.get('/shops');
  }

  async getShopById(id: string) {
    return this.client.get(`/shops/${id}`);
  }

  async updateShop(id: string, data: any) {
    return this.client.put(`/shops/${id}`, data);
  }

  async deleteShop(id: string) {
    return this.client.delete(`/shops/${id}`);
  }

  async searchShopsByName(name: string) {
    return this.client.get('/shops/search/name', { params: { name } });
  }

  async searchShopsByOwner(owner: string) {
    return this.client.get('/shops/search/owner', { params: { owner } });
  }

  async getShopMenu(id: string) {
    return this.client.get(`/shops/${id}/menus`);
  }

  // QR Code endpoints
  async generateQRCode(shopId: string, domain?: string) {
    return this.client.post(`/shops/${shopId}/generate-qr`, {}, {
      params: domain ? { domain } : {},
    });
  }

  async getQRCode(shopId: string) {
    return this.client.get(`/shops/${shopId}/qr`);
  }

  async getAllQRCodes() {
    return this.client.get('/shops/qr/list');
  }

  // Catalog endpoints
  async getAllCatalogs() {
    return this.client.get('/catalogs');
  }

  async createCatalog(data: any) {
    return this.client.post('/catalogs', data);
  }

  async getCatalogById(id: string) {
    return this.client.get(`/catalogs/${id}`);
  }

  async updateCatalog(id: string, data: any) {
    return this.client.put(`/catalogs/${id}`, data);
  }

  async deleteCatalog(id: string) {
    return this.client.delete(`/catalogs/${id}`);
  }

  async getCatalogsByShopId(shopId: string) {
    return this.client.get(`/catalogs/shop/${shopId}`);
  }

  async getCatalogsByCategory(category: string) {
    return this.client.get(`/catalogs/category/${category}`);
  }

  async getCatalogsByShopAndCategory(shopId: string, category: string) {
    return this.client.get(`/catalogs/shop/${shopId}/category/${category}`);
  }

  async getCatalogsByPriceRange(shopId: string, minPrice: number, maxPrice: number) {
    return this.client.get('/catalogs/price-range', {
      params: { shopId, minPrice, maxPrice },
    });
  }

  async getAvailableCatalogs(shopId: string) {
    return this.client.get(`/catalogs/available/${shopId}`);
  }

  async updateCatalogStatus(id: string, status: string) {
    return this.client.patch(`/catalogs/${id}/status`, {}, {
      params: { status },
    });
  }
}

export const apiClient = new ApiClient();

