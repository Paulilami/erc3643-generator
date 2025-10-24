import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './tokenSlice';
import walletReducer from './walletSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    wallet: walletReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;