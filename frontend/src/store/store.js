import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import farmReducer from './slices/farmSlice';
import inventoryReducer from './slices/inventorySlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    farm: farmReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
