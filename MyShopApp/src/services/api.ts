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
    try {
      const response = await this.client.post(`/shops/${shopId}/generate-qr`, {}, {
        params: domain ? { domain } : {},
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getQRCode(shopId: string) {
    try {
      const response = await this.client.get(`/shops/${shopId}/qr`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllQRCodes() {
    try {
      const response = await this.client.get('/shops/qr/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Catalog endpoints
  async getAllCatalogs() {
    try {
      const response = await this.client.get('/catalogs');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createCatalog(data: any) {
    try {
      const response = await this.client.post('/catalogs', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCatalogById(id: string) {
    try {
      const response = await this.client.get(`/catalogs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCatalog(id: string, data: any) {
    try {
      const response = await this.client.put(`/catalogs/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCatalog(id: string) {
    try {
      const response = await this.client.delete(`/catalogs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCatalogsByShopId(shopId: string) {
    try {
      const response = await this.client.get(`/catalogs/shop/${shopId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCatalogsByCategory(category: string) {
    try {
      const response = await this.client.get(`/catalogs/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCatalogsByShopAndCategory(shopId: string, category: string) {
    try {
      const response = await this.client.get(`/catalogs/shop/${shopId}/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCatalogsByPriceRange(shopId: string, minPrice: number, maxPrice: number) {
    try {
      const response = await this.client.get('/catalogs/price-range', {
        params: { shopId, minPrice, maxPrice },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAvailableCatalogs(shopId: string) {
    try {
      const response = await this.client.get(`/catalogs/available/${shopId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCatalogStatus(id: string, status: string) {
    try {
      const response = await this.client.patch(`/catalogs/${id}/status`, {}, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

