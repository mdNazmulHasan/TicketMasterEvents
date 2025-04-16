import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
  Button,
  StyleSheet,
} from 'react-native';
import {useGetEventDetailsQuery} from '../services/eventApi';
import {formatDate} from '../utils/helper';
import {DetailsScreenProps} from '../navigation/types';
import MapView, {Marker} from 'react-native-maps';

const DetailsScreen: React.FC<DetailsScreenProps> = ({route}) => {
  const {id} = route.params;
  const {
    data: event,
    isLoading,
    isError,
    refetch,
  } = useGetEventDetailsQuery(id);

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={styles.centered}>
        <Text>Error loading event details</Text>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  const {
    name,
    description,
    images,
    dates,
    _embedded,
    classifications,
    priceRanges,
    info,
    url,
  } = event;

  const venue = _embedded?.venues?.[0];
  const location = venue?.location;
  const classification = classifications?.[0];

  const parts = [
    classification?.segment?.name,
    classification?.genre?.name,
    classification?.subGenre?.name,
    classification?.type?.name,
    classification?.subType?.name,
  ]
    .filter(
      part =>
        typeof part === 'string' && part.trim() !== '' && part !== 'Undefined',
    )
    .join(' • ');

  const price = priceRanges?.[0];

  const handleBuyTickets = () => {
    if (url && (url.startsWith('http') || url.startsWith('https'))) {
      Linking.openURL(url);
    } else {
      console.warn('Invalid URL');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {images?.[0]?.url && (
        <Image
          source={{uri: images[0].url}}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.infoText}>{description}</Text>

        <Text style={styles.infoText}>
          {formatDate(dates.start.localDate)}
          {dates.start.localTime && ` at ${dates.start.localTime}`}
        </Text>

        {venue && (
          <>
            <Text style={styles.infoText}>{venue.name}</Text>
            <Text style={styles.infoText}>
              {venue.city.name},{' '}
              {venue.state?.stateCode || venue.country?.countryCode}
            </Text>
            {location && (
              <Text style={styles.infoText}>
                Location: {location.latitude}, {location.longitude}
              </Text>
            )}
          </>
        )}

        {parts && <Text style={styles.infoText}>{parts}</Text>}

        {price && (
          <Text style={styles.infoText}>
            ${price.min} - ${price.max}
          </Text>
        )}

        {info && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Event</Text>
            <Text style={styles.description}>{info}</Text>
          </View>
        )}

        {url && <Button title="Buy Tickets" onPress={handleBuyTickets} />}
        {location && (
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
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  mapContainer: {
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default DetailsScreen;
