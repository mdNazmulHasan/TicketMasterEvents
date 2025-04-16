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
import useColors from '../styles/colors';

const EventsScreen: React.FC<EventsScreenProps> = ({navigation}) => {
  // Theme colors
  const colors = useColors();

  // Search state
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // RTK Query lazy search
  const [triggerSearch, {isFetching, isError}] = useLazySearchEventsQuery();

  // Fetch events with pagination support
  const fetchEvents = async (reset = false) => {
    const nextPage = reset ? 0 : page + 1;

    try {
      const newEvents = await triggerSearch({keyword, page: nextPage}).unwrap();

      if (reset) {
        // Reset results for new search
        setEvents(newEvents);
        setPage(0);
        setHasMore(true);
      } else {
        // Append results for pagination
        if (newEvents.length > 0) {
          setEvents(prev => [...prev, ...newEvents]);
          setPage(nextPage);
        } else {
          setHasMore(false); // No more results
        }
      }
    } catch (err) {
      console.error('Event fetch error:', err);
      setHasMore(false);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (!keyword.trim()) return; // Ignore empty searches
    fetchEvents(true); // Reset pagination
  };

  // Load more events when scrolling
  const loadMoreEvents = () => {
    if (!hasMore || isFetching) return; // Prevent duplicate calls
    fetchEvents();
  };

  // Loading indicator for pagination
  const renderFooter = () =>
    isFetching && page > 0 ? (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={styles.footerLoader}
      />
    ) : null;

  // Empty state message
  const renderEmpty = () =>
    !isFetching && events.length === 0 ? (
      <Text style={[styles.emptyText, {color: colors.subText}]}>
        No events found.
      </Text>
    ) : null;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Search input */}
      <TextInput
        style={[styles.input, {color: colors.text, borderColor: colors.border}]}
        placeholder="Search events"
        placeholderTextColor={colors.placeholder}
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch} // Allow keyboard submit
      />

      {/* Search button */}
      <Button
        title="Search Events"
        onPress={handleSearch}
        disabled={!keyword.trim()}
        color={colors.primary}
      />

      {/* Error/loading/result states */}
      {isError ? (
        <Text style={[styles.errorText, {color: colors.error}]}>
          Error loading events. Please try again.
        </Text>
      ) : isFetching && page === 0 ? (
        // Initial loading indicator
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        // Results list
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('Detail', {id: item.id})}
            />
          )}
          contentContainerStyle={styles.flatListContentContainerStyle}
          onEndReached={loadMoreEvents}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5} // Trigger load more halfway through list
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  loader: {
    marginTop: 20,
  },
  footerLoader: {
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  flatListContentContainerStyle: {paddingBottom: 20, paddingTop: 20},
});

export default EventsScreen;
