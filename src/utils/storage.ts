// utils/storage.ts

import {MMKV} from 'react-native-mmkv';

// Create a single MMKV storage instance for the app
export const storage = new MMKV();

/**
 * Retrieves the list of favorite event IDs from storage
 * @returns Array of event IDs that have been favorited
 */
export const getFavoriteEvents = (): string[] => {
  // Get the raw string from storage
  const raw = storage.getString('favorite_events');
  // Parse JSON string or return empty array if nothing stored
  return raw ? JSON.parse(raw) : [];
};

/**
 * Toggles an event's favorite status
 * @param eventId - The ID of the event to toggle
 * @returns Boolean indicating new favorite status (true = is now favorite)
 */
export const toggleFavoriteEvent = (eventId: string): boolean => {
  // Get current favorites
  const favorites = getFavoriteEvents();
  // Check if event is already favorited
  const isFavorite = favorites.includes(eventId);

  // Create updated favorites list - either remove event or add it
  const updated = isFavorite
    ? favorites.filter(id => id !== eventId) // Remove event if already favorite
    : [...favorites, eventId]; // Add event if not favorite

  // Save updated list back to storage
  storage.set('favorite_events', JSON.stringify(updated));
  // Return new favorite status
  return !isFavorite;
};

/**
 * Checks if an event is currently marked as favorite
 * @param eventId - The ID of the event to check
 * @returns Boolean indicating if event is favorited
 */
export const isEventFavorite = (eventId: string): boolean => {
  return getFavoriteEvents().includes(eventId);
};
