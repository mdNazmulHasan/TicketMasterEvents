import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
  Button,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useGetEventDetailsQuery} from '../services/eventApi';
import {formatDate} from '../utils/helper';
import {DetailsScreenProps} from '../navigation/types';
import {useMMKVObject} from 'react-native-mmkv';
import {storage} from '../utils/storage';
import FavoriteText from '../components/FavoriteText';
import useColors from '../styles/colors';

const DetailsScreen: React.FC<DetailsScreenProps> = ({route}) => {
  const {id} = route.params;
  const {
    data: event,
    isLoading,
    isError,
    refetch,
  } = useGetEventDetailsQuery(id);
  const [favorites, setFavorites] = useMMKVObject<Record<string, any>>(
    'favorites',
    storage,
  );
  const colors = useColors();

  const isFavorited = Boolean(favorites?.[id]);

  const toggleFavorite = () => {
    setFavorites(prev => {
      const updated = {...(prev || {})};
      isFavorited ? delete updated[id] : (updated[id] = event);
      return updated;
    });
  };

  const handleRetry = () => refetch();

  const handleBuyTickets = () => {
    if (event?.url?.startsWith('http')) Linking.openURL(event.url);
    else console.warn('Invalid URL');
  };

  const classificationText = useMemo(() => {
    const c = event?.classifications?.[0];
    return [
      c?.segment?.name,
      c?.genre?.name,
      c?.subGenre?.name,
      c?.type?.name,
      c?.subType?.name,
    ]
      .filter(
        part => typeof part === 'string' && part.trim() && part !== 'Undefined',
      )
      .join(' • ');
  }, [event]);

  if (isLoading) {
    return (
      <View style={[styles.centered, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={[styles.centered, {backgroundColor: colors.background}]}>
        <Text style={{color: colors.error}}>Error loading event details</Text>
        <Button title="Retry" onPress={handleRetry} color={colors.primary} />
      </View>
    );
  }

  const {name, description, images, dates, _embedded, priceRanges, info, url} =
    event;

  const imageUrl = images?.[0]?.url;
  const venue = _embedded?.venues?.[0];
  const location = venue?.location;
  const price = priceRanges?.[0];

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {imageUrl && (
        <Image
          source={{uri: imageUrl}}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>{name}</Text>

        {description && (
          <Text style={[styles.infoText, {color: colors.subText}]}>
            {description}
          </Text>
        )}

        <Text style={[styles.infoText, {color: colors.text}]}>
          {formatDate(dates.start.localDate)}
          {dates.start.localTime && ` at ${dates.start.localTime}`}
        </Text>

        {venue && (
          <>
            <Text style={[styles.infoText, {color: colors.text}]}>
              {venue.name}
            </Text>
            <Text style={[styles.infoText, {color: colors.text}]}>
              {venue.city?.name},{' '}
              {venue.state?.stateCode || venue.country?.countryCode}
            </Text>
          </>
        )}

        {location && (
          <Text style={[styles.infoText, {color: colors.text}]}>
            Location: {location.latitude}, {location.longitude}
          </Text>
        )}

        {classificationText && (
          <Text style={[styles.infoText, {color: colors.text}]}>
            {classificationText}
          </Text>
        )}

        {price && (
          <Text style={[styles.infoText, {color: colors.text}]}>
            ${price.min} - ${price.max}
          </Text>
        )}

        {info && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>
              About the Event
            </Text>
            <Text style={[styles.description, {color: colors.subText}]}>
              {info}
            </Text>
          </View>
        )}

        <View style={styles.buttonsRow}>
          {url && (
            <Pressable
              onPress={handleBuyTickets}
              style={({pressed}) => [
                styles.button,
                {backgroundColor: colors.normalBg},
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.text, {color: colors.normalText}]}>
                Buy Tickets
              </Text>
            </Pressable>
          )}

          <FavoriteText isFavorite={isFavorited} onPress={toggleFavorite} />
        </View>

        {location && Platform.OS === 'ios' && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker
                coordinate={{
                  latitude: parseFloat(location.latitude),
                  longitude: parseFloat(location.longitude),
                }}
                title={venue?.name}
                description={venue?.city?.name}
              />
            </MapView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  eventImage: {width: '100%', height: 200},
  content: {padding: 16},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 8},
  infoText: {fontSize: 16, marginVertical: 4},
  section: {marginTop: 16},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 6},
  description: {fontSize: 15, lineHeight: 22},
  mapContainer: {
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {...StyleSheet.absoluteFillObject},
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DetailsScreen;
