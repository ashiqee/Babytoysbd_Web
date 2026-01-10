import { configureStore, combineReducers } from '@reduxjs/toolkit';

import cartsReducer from './features/cart/cart.slice';


import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Persistence configurations
const cartPersistConfig = {
  key: 'carts',
  storage,
};


// Persisted reducers
const persistedCartReducer = persistReducer(cartPersistConfig, cartsReducer);


// Combine all reducers
const appReducer = combineReducers({
   carts: persistedCartReducer,
 
});

// Root reducer to clear all state on logout
const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logoutUser') {
    // storage.removeItem('persist:carts'); // Clear persisted carts
    storage.removeItem('persist:shops'); // Clear persisted shops
    state = undefined; // Reset the entire Redux state
  }
  return appReducer(state, action);
};

// Persisted root reducer
const persistedReducer = persistReducer(
  { key: 'root', storage },
  rootReducer
);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor for redux-persist
export const persistor = persistStore(store);


// Infer the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
