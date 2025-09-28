import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import customerReducer from './customerSlice';
import leadReducer from './leadSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    leads: leadReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
