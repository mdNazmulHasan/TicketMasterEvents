import React, {useState, useCallback} from 'react';
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

const EventsScreen: React.FC<EventsScreenProps> = ({navigation}) => {
  // Theme colors
  const colors = useColors();

  // Search state
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false);

  // RTK Query lazy search
  const [triggerSearch, {isFetching, isError}] = useLazySearchEventsQuery();

  // Fetch events with pagination support
  const fetchEvents = async (reset = false) => {
    if (!keyword.trim() && reset) {
      setEvents([]);
      setPage(0);
      return;
    }

    const nextPage = reset ? 0 : page + 1;

    try {
      const newEvents = await triggerSearch({keyword, page: nextPage}).unwrap();
      setHasAttemptedSearch(true);

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

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Re-fetch the current search results from page 0
      await fetchEvents(true);
    } finally {
      setRefreshing(false);
    }
  }, [keyword]);

  // Try again handler for error state
  const handleTryAgain = () => {
    handleRefresh();
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

  // Empty state with refresh capability
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

  // Error state with refresh capability
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
        onPress={handleTryAgain}>
        <Text style={styles.refreshButtonText}>Try Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );

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
        disabled={!keyword.trim() || isFetching}
        color={colors.primary}
      />

      {/* Error/loading/result states */}
      {isError ? (
        renderError()
      ) : isFetching && page === 0 && !refreshing ? (
        // Initial loading indicator
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : events.length > 0 ? (
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
        // Empty state
        renderEmpty()
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
    paddingBottom: 20,
    paddingTop: 20,
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
