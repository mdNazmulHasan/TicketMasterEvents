import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {FavoritesScreenProps} from '../navigation/types';
import {MMKV} from 'react-native-mmkv';
import {Event} from '../types/eventTypes';
import EventCard from '../components/EventCard';
import useColors from '../styles/colors';

// Initialize MMKV storage instance
const storage = new MMKV();

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({navigation}) => {
  // Get theme colors from custom hook
  const colors = useColors();
  // State to store favorite events
  const [favorites, setFavorites] = useState<Event[]>([]);

  // Function to retrieve favorites from storage
  const getSavedFavorites = useCallback(() => {
    // Get favorites string from storage
    const stored = storage.getString('favorites');
    // If nothing stored, set empty array
    if (!stored) return setFavorites([]);

    try {
      // Parse JSON string into object
      const parsed = JSON.parse(stored);
      // Convert object values to array
      const favoriteEvents: Event[] = Object.values(parsed);
      setFavorites(favoriteEvents);
    } catch (error) {
      // Handle potential JSON parsing errors
      console.error('❌ Failed to parse favorites from storage:', error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    // Load favorites when component mounts
    getSavedFavorites();
    // Refresh favorites when screen comes into focus
    const unsubscribe = navigation.addListener('focus', getSavedFavorites);
    // Clean up listener when component unmounts
    return unsubscribe;
  }, [navigation, getSavedFavorites]);

  // Render function for each event item
  const renderItem = ({item}: {item: Event}) => (
    <EventCard
      event={item}
      onPress={() => navigation.navigate('Detail', {id: item.id})}
    />
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {favorites.length > 0 ? (
        // Display list if favorites exist
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        // Display message if no favorites
        <Text style={[styles.noFavText, {color: colors.subText}]}>
          You have no favorite events yet.
        </Text>
      )}
    </View>
  );
};

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noFavText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default FavoritesScreen;
