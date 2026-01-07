// Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  shopName?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  error: string | null;
}

export interface AuthResponse {
  oauth_token: string;
  shopId: string;
  shop_name?: string;
  owner_name?: string;
  email?: string;
  userId?: string;
  message?: string;
}

export interface CreateUserResponse {
  status: string;
  message: string;
  userId: string;
}

// Shop Types
export interface Theme {
  colors?: {
    primary: string;
    secondary: string;
  };
  menu?: string;
  lookAndFeel?: string;
  logo?: string;
}

export interface Shop {
  _id: string;
  name: string;
  address: string;
  owner: string;
  email?: string;
  mobile_country_code?: string;
  mobile_number?: string;
  theme?: Theme;
  qr_code?: string;
  qr_code_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopCreate {
  name: string;
  address: string;
  owner: string;
  email?: string;
  mobile_country_code?: string;
  mobile_number?: string;
  theme?: Theme;
}

// Catalog Types
export interface Catalog {
  _id: string;
  name: string;
  description?: string;
  category: string;
  shopId: string;
  unit: string;
  price?: Price;
  availability?: Availability;
  stock?: Stock;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
}

export interface Price {
  currency: string;
  value: number;
  discountPercentage?: number;
  discountedPrice?: number;
}

export interface Availability {
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  availableDays?: string[];
  seasonalAvailable?: boolean;
  season?: string;
}

export interface Stock {
  quantity: number;
  unit: string;
  reorderLevel: number;
}

// Error Types
export interface ApiError {
  status: string;
  message: string;
  details?: string;
}

export interface ShopUpdate {
  name?: string;
  address?: string;
  owner?: string;
  email?: string;
  mobile_country_code?: string;
  mobile_number?: string;
  theme?: Theme;
}

// Catalog Types
export interface Price {
  currency: string;
  value: number;
  discountPercentage?: number;
  discountedPrice?: number;
}

export interface Availability {
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  availableDays?: string[];
  seasonalAvailable?: boolean;
  season?: string;
}

export interface Stock {
  quantity: number;
  unit: string;
  reorderLevel?: number;
}

export interface Catalog {
  _id: string;
  name: string;
  description?: string;
  category: string;
  shopId: string;
  unit: string;
  price: Price;
  availability?: Availability;
  stock?: Stock;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

export interface CatalogCreate {
  name: string;
  description?: string;
  category: string;
  shopId: string;
  unit: string;
  price: Price;
  availability?: Availability;
  stock?: Stock;
  status?: string;
  metadata?: Record<string, any>;
}

export interface CatalogUpdate {
  name?: string;
  description?: string;
  price?: Price;
  availability?: Availability;
  stock?: Stock;
  status?: string;
}

// QR Code Types
export interface QRCodeResponse {
  status: string;
  message: string;
  shopId: string;
  shopName: string;
  qrCodeUrl: string;
  qrCode: string;
}

// Shop Menu
export interface ShopMenu {
  shopId: string;
  shopName: string;
  address: string;
  owner: string;
  totalItems: number;
  fetchedAt: string;
  catalogs: Catalog[];
}

// API Response
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  details?: string;
}

export interface ApiError {
  status: string;
  message: string;
  details?: string;
}

