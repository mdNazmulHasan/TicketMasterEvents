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
  const colors = useColors();
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [triggerSearch, {isFetching, isError}] = useLazySearchEventsQuery();

  const fetchEvents = async (reset = false) => {
    const nextPage = reset ? 0 : page + 1;

    try {
      const newEvents = await triggerSearch({keyword, page: nextPage}).unwrap();

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
    fetchEvents(true);
  };

  const loadMoreEvents = () => {
    if (!hasMore || isFetching) return;
    fetchEvents();
  };

  const renderFooter = () =>
    isFetching && page > 0 ? (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={styles.footerLoader}
      />
    ) : null;

  const renderEmpty = () =>
    !isFetching && events.length === 0 ? (
      <Text style={[styles.emptyText, {color: colors.subText}]}>
        No events found.
      </Text>
    ) : null;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TextInput
        style={[styles.input, {color: colors.text, borderColor: colors.border}]}
        placeholder="Search events"
        placeholderTextColor={colors.placeholder}
        value={keyword}
        onChangeText={setKeyword}
      />
      <Button
        title="Search Events"
        onPress={handleSearch}
        disabled={!keyword.trim()}
        color={colors.primary}
      />

      {isError ? (
        <Text style={[styles.errorText, {color: colors.error}]}>
          Error loading events. Please try again.
        </Text>
      ) : isFetching && page === 0 ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
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
          contentContainerStyle={{paddingBottom: 20, paddingTop: 20}}
          onEndReached={loadMoreEvents}
          showsVerticalScrollIndicator={false}
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
});

export default EventsScreen;
