import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useLazySearchEventsQuery} from '../services/eventApi';
import EventCard from '../components/EventCard';
import {EventsScreenProps} from '@navigation/types';
import useColors from '../styles/colors';

const DEFAULT_KEYWORD = 'upcoming';

const EventsScreen: React.FC<EventsScreenProps> = ({navigation}) => {
  const colors = useColors(); // Access color styles

  const [keyword, setKeyword] = useState(''); // State for search keyword
  const [city, setCity] = useState(''); // State for search city
  const [page, setPage] = useState(0); // Current page for pagination
  const [events, setEvents] = useState([]); // Array of events
  const [hasMore, setHasMore] = useState(true); // Whether there are more events to load
  const [refreshing, setRefreshing] = useState(false); // For handling pull-to-refresh
  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false); // Flag to check if search has been attempted

  // Lazy-loaded query to fetch events
  const [triggerSearch, {isFetching, isError}] = useLazySearchEventsQuery();

  // Function to fetch events with pagination and search filters
  const fetchEvents = async (
    reset = false,
    searchKeyword = keyword.trim(),
    searchCity = city.trim(),
  ) => {
    const nextPage = reset ? 0 : page + 1;

    try {
      const newEvents = await triggerSearch({
        keyword: searchKeyword,
        city: searchCity,
        page: nextPage,
      }).unwrap();

      setHasAttemptedSearch(true); // Mark search as attempted

      // If resetting, clear current events and set the new ones
      if (reset) {
        setEvents(newEvents);
        setPage(0);
        setHasMore(true);
      } else {
        // Append new events if there are more results
        if (newEvents.length > 0) {
          setEvents(prev => [...prev, ...newEvents]);
          setPage(nextPage);
        } else {
          setHasMore(false); // No more events to load
        }
      }
    } catch (err) {
      console.error('Event fetch error:', err);
      setHasMore(false); // Stop fetching if error occurs
    }
  };

  useEffect(() => {
    // Initial fetch on screen load with default keyword
    fetchEvents(true, DEFAULT_KEYWORD);
  }, []);

  // Handles search button press
  const handleSearch = () => {
    if (!keyword.trim() && !city.trim()) return; // Skip search if both are empty
    fetchEvents(true); // Perform search
  };

  // Load more events when scrolling
  const loadMoreEvents = () => {
    if (!hasMore || isFetching) return; // Prevent fetching if no more events or already fetching
    fetchEvents(); // Fetch more events
  };

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setKeyword(''); // Reset search keyword
      setCity(''); // Reset city search
      await fetchEvents(true, DEFAULT_KEYWORD, ''); // Refresh events with default keyword
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Render footer loader when fetching more events
  const renderFooter = () =>
    isFetching && page > 0 ? (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={styles.footerLoader}
      />
    ) : null;

  // Render empty state if no events are found
  const renderEmpty = () => {
    if (isFetching && page === 0) return null;

    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        <Text style={[styles.emptyText, {color: colors.subText}]}>
          {hasAttemptedSearch
            ? 'No events found.'
            : 'Search for events to get started.'}
        </Text>
        {hasAttemptedSearch && (
          <TouchableOpacity
            style={[styles.refreshButton, {backgroundColor: colors.primary}]}
            onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  // Render error state if there's an issue fetching events
  const renderError = () => (
    <ScrollView
      contentContainerStyle={styles.emptyContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }>
      <Text style={[styles.errorText, {color: colors.error}]}>
        Error loading events. Please try again.
      </Text>
      <TouchableOpacity
        style={[styles.refreshButton, {backgroundColor: colors.primary}]}
        onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Try Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Input fields for search keyword and city */}
      <TextInput
        style={[styles.input, {color: colors.text, borderColor: colors.border}]}
        placeholder="Search by keyword"
        placeholderTextColor={colors.placeholder}
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
      />
      <TextInput
        style={[styles.input, {color: colors.text, borderColor: colors.border}]}
        placeholder="Search by city"
        placeholderTextColor={colors.placeholder}
        value={city}
        onChangeText={setCity}
        onSubmitEditing={handleSearch}
      />
      {/* Search button to trigger event search */}
      <Button
        title="Search Events"
        onPress={handleSearch}
        disabled={(!keyword.trim() && !city.trim()) || isFetching}
        color={colors.primary}
      />

      {/* Display error, loading, or event list based on state */}
      {isError ? (
        renderError() // Show error if fetching fails
      ) : isFetching && page === 0 && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : events.length > 0 ? (
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
          onEndReached={loadMoreEvents} // Load more events on scroll
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter} // Show footer loader if needed
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        renderEmpty() // Show empty state if no events
      )}
    </View>
  );
};

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  flatListContentContainerStyle: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default EventsScreen;
