import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {FavoritesScreenProps} from '../navigation/types';
import {MMKV} from 'react-native-mmkv';
import {Event} from '../types/eventTypes';
import EventCard from '../components/EventCard';
import useColors from '../styles/colors';

const storage = new MMKV();

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({navigation}) => {
  const colors = useColors();
  const [favorites, setFavorites] = useState<Event[]>([]);

  const getSavedFavorites = useCallback(() => {
    const stored = storage.getString('favorites');
    if (!stored) return setFavorites([]);

    try {
      const parsed = JSON.parse(stored);
      const favoriteEvents: Event[] = Object.values(parsed);
      setFavorites(favoriteEvents);
    } catch (error) {
      console.error('❌ Failed to parse favorites from storage:', error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    getSavedFavorites();
    const unsubscribe = navigation.addListener('focus', getSavedFavorites);
    return unsubscribe;
  }, [navigation, getSavedFavorites]);

  const renderItem = ({item}: {item: Event}) => (
    <EventCard
      event={item}
      onPress={() => navigation.navigate('Detail', {id: item.id})}
    />
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={[styles.noFavText, {color: colors.subText}]}>
          You have no favorite events yet.
        </Text>
      )}
    </View>
  );
};

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
