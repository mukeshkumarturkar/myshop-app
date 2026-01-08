import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop } from '../types';

interface ShopState {
  currentShop: Shop | null;
  shops: Shop[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  currentShop: null,
  shops: [],
  isLoading: false,
  error: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentShop: (state, action: PayloadAction<Shop | null>) => {
      state.currentShop = action.payload;
      state.error = null;
    },
    setShops: (state, action: PayloadAction<Shop[]>) => {
      state.shops = action.payload;
    },
    addShop: (state, action: PayloadAction<Shop>) => {
      state.shops.push(action.payload);
    },
    updateShopInList: (state, action: PayloadAction<Shop>) => {
      const index = state.shops.findIndex(s => s._id === action.payload._id);
      if (index !== -1) {
        state.shops[index] = action.payload;
      }
      if (state.currentShop?._id === action.payload._id) {
        state.currentShop = action.payload;
      }
    },
    removeShop: (state, action: PayloadAction<string>) => {
      state.shops = state.shops.filter(s => s._id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setCurrentShop,
  setShops,
  addShop,
  updateShopInList,
  removeShop,
  setError,
  clearError,
} = shopSlice.actions;

export default shopSlice.reducer;

