import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Event} from '../types/eventTypes';
import {formatDate} from '../utils/helper';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({event, onPress}) => {
  const imageUrl =
    event.images?.find(img => img.ratio === '3_2')?.url ||
    event.images?.[0]?.url;

  const venueName = event._embedded?.venues?.[0]?.name;
  const date = formatDate(event.dates.start.localDate);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {imageUrl && <Image source={{uri: imageUrl}} style={styles.image} />}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.name}
        </Text>

        <Text style={styles.date}>{date}</Text>

        {venueName && (
          <Text style={styles.venue} numberOfLines={1}>
            {venueName}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  venue: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
});

export default EventCard;
