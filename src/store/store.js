import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import customersReducer from './slices/customersSlice';
import authReducer from './slices/authSlice';
import contentReducer from './slices/contentSlice';
import userReducer from './slices/userSlice';
import mediaReducer from './slices/mediaSlice';
import { combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // only auth will be persisted
};

const rootReducer = combineReducers({
  customers: customersReducer,
  auth: authReducer,
  content: contentReducer,
  users: userReducer,
  media: mediaReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);