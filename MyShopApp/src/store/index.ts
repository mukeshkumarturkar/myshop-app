import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import shopReducer from './shopSlice';
import catalogReducer from './catalogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer,
    catalog: catalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

