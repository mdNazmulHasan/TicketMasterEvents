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

const DEFAULT_KEYWORD = ''; // Can be changed to 'upcoming' or 'all'

const EventsScreen: React.FC<EventsScreenProps> = ({navigation}) => {
  const colors = useColors();

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false);

  const [triggerSearch, {isFetching, isError}] = useLazySearchEventsQuery();

  const fetchEvents = async (reset = false, searchKeyword = keyword.trim()) => {
    const nextPage = reset ? 0 : page + 1;

    try {
      const newEvents = await triggerSearch({
        keyword: searchKeyword,
        page: nextPage,
      }).unwrap();

      setHasAttemptedSearch(true);

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

  useEffect(() => {
    fetchEvents(true, DEFAULT_KEYWORD);
  }, []);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    fetchEvents(true);
  };

  const loadMoreEvents = () => {
    if (!hasMore || isFetching) return;
    fetchEvents();
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchEvents(true);
    } finally {
      setRefreshing(false);
    }
  }, [keyword]);

  const renderFooter = () =>
    isFetching && page > 0 ? (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={styles.footerLoader}
      />
    ) : null;

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
      <TextInput
        style={[styles.input, {color: colors.text, borderColor: colors.border}]}
        placeholder="Search events"
        placeholderTextColor={colors.placeholder}
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
      />

      <Button
        title="Search Events"
        onPress={handleSearch}
        disabled={!keyword.trim() || isFetching}
        color={colors.primary}
      />

      {isError ? (
        renderError()
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
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
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
        renderEmpty()
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
