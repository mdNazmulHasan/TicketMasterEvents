import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useLazySearchEventsQuery} from '../services/eventApi';
import EventCard from '../components/EventCard';
import {EventsScreenProps} from '@navigation/types';

const EventsScreen: React.FC<EventsScreenProps> = ({navigation}) => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [triggerSearch, {isFetching, isError}] = useLazySearchEventsQuery();

  const fetchEvents = async (reset = false) => {
    const nextPage = reset ? 0 : page + 1;

    try {
      const newEvents = await triggerSearch({
        keyword,
        page: nextPage,
      }).unwrap();

      if (reset) {
        setEvents(newEvents);
        setPage(0);
        setHasMore(true);
      } else {
        if (newEvents.length > 0) {
          setEvents(prev => [...prev, ...newEvents]);
          setPage(nextPage);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Event fetch error:', err);
      setHasMore(false);
    }
  };

  const handleSearch = () => {
    if (!keyword.trim()) return;
    fetchEvents(true); // Reset search
  };

  const loadMoreEvents = () => {
    if (!hasMore || isFetching) return;
    fetchEvents(); // Load next page
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search events"
        value={keyword}
        onChangeText={setKeyword}
      />
      <Button title="Search Events" onPress={handleSearch} disabled={!keyword.trim()} />

      {isError ? (
        <Text style={styles.errorText}>Error loading events. Please try again.</Text>
      ) : isFetching && page === 0 ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('Detail', {id: item.id})}
            />
          )}
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && page > 0 ? <ActivityIndicator size="small" style={{marginVertical: 10}} /> : null
          }
          ListEmptyComponent={
            !isFetching && events.length === 0 ? (
              <Text style={styles.emptyText}>No events found.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  loader: { marginTop: 20 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  errorText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'red' },
});

export default EventsScreen;
