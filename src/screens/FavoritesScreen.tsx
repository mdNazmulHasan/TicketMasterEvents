import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {FavoritesScreenProps} from '../navigation/types';
import {MMKV} from 'react-native-mmkv';
import {Event} from '../types/eventTypes';
import EventCard from '../components/EventCard'; // Assuming EventCard is imported

const storage = new MMKV();

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({navigation}) => {
  const [favorites, setFavorites] = useState<Event[]>([]);

  useEffect(() => {
    const stored = storage.getString('favorites');
    console.log('🚀 Stored favorites:', stored); // Debugging log

    if (stored) {
      try {
        // Parse the stored string to an object
        const parsed = JSON.parse(stored);

        // Convert object into an array of events
        const favoriteEvents = Object.values(parsed);

        console.log('🚀 Parsed favorites:', favoriteEvents); // Debugging log
        setFavorites(favoriteEvents);
      } catch (e) {
        console.error('Failed to parse favorites from storage', e);
      }
    } else {
      console.log('🚀 No favorites found in storage'); // Debugging log
    }
  }, []);

  const renderItem = ({item}: {item: Event}) => (
    <EventCard
      event={item}
      onPress={() => navigation.navigate('Detail', {id: item.id})}
    />
  );

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 20}}
        />
      ) : (
        <Text style={styles.noFavText}>You have no favorite events yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  noFavText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
    color: '#666',
  },
});

export default FavoritesScreen;
