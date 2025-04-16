// utils/storage.ts
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

export const getFavoriteEvents = (): string[] => {
  const raw = storage.getString('favorite_events');
  return raw ? JSON.parse(raw) : [];
};

export const toggleFavoriteEvent = (eventId: string): boolean => {
  const favorites = getFavoriteEvents();
  const isFavorite = favorites.includes(eventId);

  const updated = isFavorite
    ? favorites.filter(id => id !== eventId)
    : [...favorites, eventId];

  storage.set('favorite_events', JSON.stringify(updated));
  return !isFavorite; // return new state
};

export const isEventFavorite = (eventId: string): boolean => {
  return getFavoriteEvents().includes(eventId);
};
