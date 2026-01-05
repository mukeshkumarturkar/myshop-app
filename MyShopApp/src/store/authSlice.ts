import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export default authSlice.reducer;
export const { setLoading, setUser, setError, clearError, logout } = authSlice.actions;

});
  },
    },
      state.error = null;
      state.isSignedIn = false;
      state.user = null;
    logout: (state) => {
    },
      state.error = null;
    clearError: (state) => {
    },
      state.isLoading = false;
      state.error = action.payload;
    setError: (state, action: PayloadAction<string>) => {
    },
      state.error = null;
      state.isSignedIn = !!action.payload;
      state.user = action.payload;
    setUser: (state, action: PayloadAction<User | null>) => {
    },
      state.isLoading = action.payload;
    setLoading: (state, action: PayloadAction<boolean>) => {
  reducers: {
  initialState,
  name: 'auth',
const authSlice = createSlice({

};
  error: null,
  isSignedIn: false,
  isLoading: false,
  user: null,
const initialState: AuthState = {

import { AuthState, User } from '../../types';

