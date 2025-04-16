import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Event} from '../types/eventTypes';
import {formatDate} from '../utils/helper';
import Colors from '../styles/colors';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({event, onPress}) => {
  const imageUrl = getImageUrl(event);
  const date = formatDate(event.dates.start.localDate);
  const venueName = event._embedded?.venues?.[0]?.name;
  const classificationText = getClassificationText(event);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={styles.date}>{date}</Text>
        {classificationText && (
          <Text style={styles.infoText} numberOfLines={1}>
            {classificationText}
          </Text>
        )}
        {venueName && (
          <Text style={styles.venue} numberOfLines={1}>
            {venueName}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ===== Helper Functions =====

const getImageUrl = (event: Event): string | undefined => {
  return (
    event.images?.find(img => img.ratio === '3_2')?.url ||
    event.images?.[0]?.url
  );
};

const getClassificationText = (event: Event): string => {
  const classification = event.classifications?.[0];

  const parts = [
    classification?.segment?.name,
    classification?.genre?.name,
    classification?.subGenre?.name,
    classification?.type?.name,
    classification?.subType?.name,
  ];

  return parts
    .filter(
      part =>
        typeof part === 'string' && part.trim() !== '' && part !== 'Undefined',
    )
    .join(' • ');
};

// ===== Styles =====

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: Colors.placeholder,
    borderRadius: 8,
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
    color: Colors.subText,
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.info,
    marginTop: 2,
  },
  venue: {
    fontSize: 14,
    color: Colors.subText,
    marginTop: 2,
  },
});

export default EventCard;
