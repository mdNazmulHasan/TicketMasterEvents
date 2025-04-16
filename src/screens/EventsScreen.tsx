import React, {useState, useCallback} from 'react';
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
  const [hasMore, setHasMore] = useState(true);

  const [triggerSearch, {data: events = [], isFetching, isError}] =
    useLazySearchEventsQuery();

  const handleFetchEvents = useCallback(
    async (reset = false) => {
      const nextPage = reset ? 0 : page + 1;

      try {
        const newEvents = await triggerSearch({
          keyword,
          page: nextPage,
        }).unwrap();

        if (newEvents.length > 0) {
          setPage(reset ? 0 : nextPage);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Event fetch error:', error);
        setHasMore(false);
      }
    },
    [keyword, page, triggerSearch],
  );

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setHasMore(true);
    handleFetchEvents(true); // Reset search results
  };

  const loadMoreEvents = () => {
    if (!hasMore || isFetching) return;
    handleFetchEvents(); // Fetch next page of events
  };

  const renderFooter = () => {
    if (isFetching && page > 0) {
      return <ActivityIndicator size="small" style={styles.footerLoader} />;
    }
    return null;
  };

  const renderEmpty = () => {
    if (isFetching || page > 0) return null;
    return (
      <Text style={styles.emptyText}>
        No events found. Try a different keyword.
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter keyword"
        value={keyword}
        onChangeText={setKeyword}
      />
      <Button
        title="Search Events"
        onPress={handleSearch}
        disabled={!keyword.trim()}
      />

      {isError ? (
        <Text style={styles.errorText}>
          Error loading events. Please try again.
        </Text>
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
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  loader: {
    marginTop: 20,
  },
  footerLoader: {
    marginVertical: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default EventsScreen;
