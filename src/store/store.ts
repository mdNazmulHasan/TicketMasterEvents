import {configureStore} from '@reduxjs/toolkit';
import {eventApi} from '../services/eventApi';

export const store = configureStore({
  // Configure root reducer with API slice
  reducer: {
    // Use computed property name to add eventApi reducer to store
    [eventApi.reducerPath]: eventApi.reducer,
  },
  // Add RTK Query middleware to the default middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(eventApi.middleware),
});

// TypeScript type definitions for global state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
