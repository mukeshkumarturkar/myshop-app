import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError } from '../types';

// API Base URL - uses EXPO_PUBLIC_API_URL environment variable
// Default: http://api.soanch.com (production)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://api.soanch.com';

console.log('🔴 API Client: Base URL =', API_BASE_URL);

class ApiClient {
  private client: AxiosInstance;
  private publicAccessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load public access token from storage
    this.loadPublicAccessToken();

    // Add interceptors
    this.setupInterceptors();
  }

  /**
   * Load public access token from AsyncStorage
   */
  private async loadPublicAccessToken() {
    try {
      const token = await AsyncStorage.getItem('publicAccessToken');
      if (token) {
        this.publicAccessToken = token;
        console.log('🔴 API Client: Public access token loaded from storage');
      }
    } catch (error) {
      console.error('Error loading public access token:', error);
    }
  }

  /**
   * Get or refresh public access token
   * This is called before making requests to protected endpoints
   */
  private async getPublicAccessToken(): Promise<string> {
    // If token exists in memory, use it
    if (this.publicAccessToken) {
      console.log('🔴 API Client: Using existing public access token');
      return this.publicAccessToken;
    }

    // Try to load from storage
    const storedToken = await AsyncStorage.getItem('publicAccessToken');
    if (storedToken) {
      this.publicAccessToken = storedToken;
      console.log('🔴 API Client: Retrieved public access token from storage');
      return storedToken;
    }

    // If no token exists, we need to authenticate first
    // This will be called when making requests that need the public token
    throw new Error('No public access token available. Please authenticate first.');
  }

  /**
   * Set public access token after successful authentication
   */
  private async setPublicAccessToken(token: string) {
    this.publicAccessToken = token;
    try {
      await AsyncStorage.setItem('publicAccessToken', token);
      console.log('🔴 API Client: Public access token saved to storage');
    } catch (error) {
      console.error('Error saving public access token:', error);
    }
  }

  /**
   * Set private OAuth token (used for protected operations)
   */
  private async setPrivateOAuthToken(token: string) {
    try {
      await AsyncStorage.setItem('authToken', token);
      console.log('🔴 API Client: Private OAuth token saved to storage');
    } catch (error) {
      console.error('Error saving private OAuth token:', error);
    }
  }

  private setupInterceptors() {
    // Request interceptor - add auth tokens
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔴 API Client: Added private OAuth token to request');
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
          console.error('🔴 API Client: 401 Unauthorized - Token may be expired');
          // Clear tokens
          AsyncStorage.removeItem('authToken');
          AsyncStorage.removeItem('publicAccessToken');
          this.publicAccessToken = null;
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * AUTHENTICATION ENDPOINTS
   */

  /**
   * Public Authentication - Get public access token without credentials
   * MODE 1: Public mode - no credentials needed, returns public token only (7 days)
   * MODE 2: Password mode - with credentials, returns both tokens (90 days private + 7 days public)
   */
  async authenticate(userIdOrShopId?: string, password?: string) {
    try {
      const isPasswordMode = userIdOrShopId && password;

      if (isPasswordMode) {
        // MODE 2: Password-verified authentication
        console.log('🔴 API Client: PASSWORD MODE - Authenticating user:', userIdOrShopId);
        const response = await this.client.post('/api/shops/auth', {
          userId: userIdOrShopId,
          password: password,
        });

        const data = response.data;

        // Save both tokens
        if (data.oauthToken) {
          await this.setPrivateOAuthToken(data.oauthToken);
        }

        if (data.publicAccessToken) {
          await this.setPublicAccessToken(data.publicAccessToken);
        }

        console.log('🔴 API Client: PASSWORD MODE - Authentication successful');
        return data;
      } else {
        // MODE 1: Public mode - get public token without credentials
        // IMPORTANT: Send EMPTY BODY {} - no userId, no password!
        console.log('🔴 API Client: PUBLIC MODE - Getting public access token');
        console.log('🔴 API Client: PUBLIC MODE - Sending EMPTY BODY (no credentials)');

        const response = await this.client.post('/api/shops/auth', {});

        const data = response.data;

        // Save public token
        if (data.publicAccessToken) {
          await this.setPublicAccessToken(data.publicAccessToken);
        }

        console.log('🔴 API Client: PUBLIC MODE - Public access token obtained');
        return data;
      }
    } catch (error: any) {
      console.error('🔴 API Client: Authentication failed:', error.message);
      throw error;
    }
  }

  /**
   * Create a new shop user account
   * Requires public access token
   */
  async createUser(shopId: string, password: string, confirmPassword: string) {
    try {
      console.log('🔴 API Client: Creating user for shop:', shopId);
      const token = await this.getPublicAccessToken();

      const response = await this.client.post(
        '/api/shops/user',
        {
          shopId,
          password,
          confirmPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('🔴 API Client: User created successfully');
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Create user failed:', error.message);
      throw error;
    }
  }

  /**
   * Reset user password
   * Requires public access token
   */
  async resetPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    try {
      console.log('🔴 API Client: Resetting password for user:', userId);
      const token = await this.getPublicAccessToken();

      const response = await this.client.post(
        '/api/shops/reset-password',
        {
          userId,
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('🔴 API Client: Password reset successfully');
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Reset password failed:', error.message);
      throw error;
    }
  }

  /**
   * SHOP ENDPOINTS
   */

  /**
   * Create a new shop
   * Requires private OAuth token
   */
  async createShop(data: any) {
    try {
      console.log('🔴 API Client: Creating shop');
      const response = await this.client.post('/api/shops', data);
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Create shop failed:', error.message);
      throw error;
    }
  }

  /**
   * Get all shops (public endpoint)
   */
  async getAllShops() {
    try {
      console.log('🔴 API Client: Getting all shops');
      const response = await this.client.get('/api/shops');
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Get all shops failed:', error.message);
      throw error;
    }
  }

  /**
   * Get shop by ID (public endpoint)
   */
  async getShop(id: string) {
    try {
      console.log('🔴 API Client: Getting shop:', id);
      const response = await this.client.get(`/api/shops/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Get shop failed:', error.message);
      throw error;
    }
  }

  /**
   * Update shop details
   * Requires private OAuth token
   */
  async updateShop(id: string, data: any) {
    try {
      console.log('🔴 API Client: Updating shop:', id);
      const response = await this.client.put(`/api/shops/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Update shop failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete shop
   * Requires private OAuth token
   */
  async deleteShop(id: string) {
    try {
      console.log('🔴 API Client: Deleting shop:', id);
      const response = await this.client.delete(`/api/shops/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Delete shop failed:', error.message);
      throw error;
    }
  }

  /**
   * Search shops by name
   */
  async searchShopsByName(name: string) {
    try {
      const response = await this.client.get('/api/shops/search/name', { params: { name } });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Search shops by owner
   */
  async searchShopsByOwner(owner: string) {
    try {
      const response = await this.client.get('/api/shops/search/owner', { params: { owner } });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get shop menu with catalog items
   */
  async getShopMenu(id: string) {
    try {
      const response = await this.client.get(`/api/shops/${id}/menus`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * QR CODE ENDPOINTS
   */

  /**
   * Generate QR code for shop
   */
  async generateQRCode(shopId: string) {
    try {
      console.log('🔴 API Client: Generating QR code for shop:', shopId);
      const response = await this.client.post(`/api/shops/${shopId}/generate-qr`);
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Generate QR code failed:', error.message);
      throw error;
    }
  }

  /**
   * Get QR code for shop
   */
  async getQRCode(shopId: string) {
    try {
      const response = await this.client.get(`/api/shops/${shopId}/qr-code`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * CATALOG ENDPOINTS
   */

  /**
   * Create catalog item
   * Requires private OAuth token
   */
  async createCatalog(shopId: string, data: any) {
    try {
      console.log('🔴 API Client: Creating catalog item for shop:', shopId);
      const response = await this.client.post('/api/catalogs', {
        ...data,
        shopId,
      });
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Create catalog failed:', error.message);
      throw error;
    }
  }

  /**
   * Get all catalogs
   */
  async getAllCatalogs() {
    try {
      const response = await this.client.get('/api/catalogs');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get catalog by ID
   */
  async getCatalogById(id: string) {
    try {
      const response = await this.client.get(`/api/catalogs/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Update catalog item
   * Requires private OAuth token
   */
  async updateCatalog(id: string, data: any) {
    try {
      console.log('🔴 API Client: Updating catalog:', id);
      const response = await this.client.put(`/api/catalogs/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Update catalog failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete catalog item
   * Requires private OAuth token
   */
  async deleteCatalog(id: string) {
    try {
      console.log('🔴 API Client: Deleting catalog:', id);
      const response = await this.client.delete(`/api/catalogs/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Delete catalog failed:', error.message);
      throw error;
    }
  }

  /**
   * Get catalogs by shop ID
   */
  async getCatalogsByShopId(shopId: string) {
    try {
      console.log('🔴 API Client: Getting catalogs for shop:', shopId);
      const response = await this.client.get(`/api/catalogs/search/shop/${shopId}`);
      return response.data;
    } catch (error: any) {
      console.error('🔴 API Client: Get catalogs by shop failed:', error.message);
      throw error;
    }
  }

  /**
   * Get catalogs by category
   */
  async getCatalogsByCategory(category: string) {
    try {
      const response = await this.client.get('/api/catalogs/search/category', {
        params: { category },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get shop users
   */
  async getShopUsers(shopId: string) {
    try {
      const response = await this.client.get(`/api/shops/${shopId}/users`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Add shop user
   * Requires private OAuth token
   */
  async addShopUser(shopId: string, userData: any) {
    try {
      const response = await this.client.post(`/api/shops/${shopId}/users`, userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Remove shop user
   * Requires private OAuth token
   */
  async removeShopUser(userId: string) {
    try {
      const response = await this.client.delete(`/api/shops/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Clear all tokens (logout)
   */
  async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('publicAccessToken');
      this.publicAccessToken = null;
      console.log('🔴 API Client: User logged out successfully');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

