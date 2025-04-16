import {configureStore} from '@reduxjs/toolkit';
import {eventApi} from '../services/eventApi';

export const store = configureStore({
  reducer: {
    [eventApi.reducerPath]: eventApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(eventApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
