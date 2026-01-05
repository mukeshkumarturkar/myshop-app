import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Catalog } from '../../types';

interface CatalogState {
  catalogs: Catalog[];
  selectedCatalog: Catalog | null;
  isLoading: boolean;
  error: string | null;
  filteredByShop: Catalog[];
}

const initialState: CatalogState = {
  catalogs: [],
  selectedCatalog: null,
  isLoading: false,
  error: null,
  filteredByShop: [],
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCatalogs: (state, action: PayloadAction<Catalog[]>) => {
      state.catalogs = action.payload;
    },
    setCatalogsByShop: (state, action: PayloadAction<Catalog[]>) => {
      state.filteredByShop = action.payload;
    },
    setSelectedCatalog: (state, action: PayloadAction<Catalog | null>) => {
      state.selectedCatalog = action.payload;
    },
    addCatalog: (state, action: PayloadAction<Catalog>) => {
      state.catalogs.push(action.payload);
      state.filteredByShop.push(action.payload);
    },
    updateCatalog: (state, action: PayloadAction<Catalog>) => {
      const index = state.catalogs.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.catalogs[index] = action.payload;
      }
      const shopIndex = state.filteredByShop.findIndex(c => c._id === action.payload._id);
      if (shopIndex !== -1) {
        state.filteredByShop[shopIndex] = action.payload;
      }
      if (state.selectedCatalog?._id === action.payload._id) {
        state.selectedCatalog = action.payload;
      }
    },
    removeCatalog: (state, action: PayloadAction<string>) => {
      state.catalogs = state.catalogs.filter(c => c._id !== action.payload);
      state.filteredByShop = state.filteredByShop.filter(c => c._id !== action.payload);
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
  setCatalogs,
  setCatalogsByShop,
  setSelectedCatalog,
  addCatalog,
  updateCatalog,
  removeCatalog,
  setError,
  clearError,
} = catalogSlice.actions;

export default catalogSlice.reducer;

