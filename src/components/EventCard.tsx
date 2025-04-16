import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Event} from '../types/eventTypes';
import {formatDate} from '../utils/helper';
import useColors from '../styles/colors';

interface EventCardProps {
  event: Event; // Event object containing event details
  onPress: () => void; // Callback when the card is pressed
}

const EventCard: React.FC<EventCardProps> = ({event, onPress}) => {
  const colors = useColors(); // Get theme-based colors (e.g., dark/light mode)
  const imageUrl = getImageUrl(event); // Get preferred image URL
  const date = formatDate(event.dates.start.localDate); // Format event date
  const venueName = event._embedded?.venues?.[0]?.name; // Safely get venue name
  const classificationText = getClassificationText(event); // Get classification summary

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, {backgroundColor: colors.card}]}
      activeOpacity={0.8} // Slight opacity when pressed
    >
      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.image} />
      ) : (
        // Placeholder if image is missing
        <View
          style={[
            styles.imagePlaceholder,
            {backgroundColor: colors.placeholder},
          ]}
        />
      )}
      <View style={styles.content}>
        {/* Event title */}
        <Text style={[styles.title, {color: colors.text}]} numberOfLines={2}>
          {event.name}
        </Text>

        {/* Event date */}
        <Text style={[styles.date, {color: colors.subText}]}>{date}</Text>

        {/* Classification (genre/type) */}
        {classificationText && (
          <Text
            style={[styles.infoText, {color: colors.subText}]}
            numberOfLines={1}>
            {classificationText}
          </Text>
        )}

        {/* Venue name */}
        {venueName && (
          <Text
            style={[styles.venue, {color: colors.subText}]}
            numberOfLines={1}>
            {venueName}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ===== Helper Functions =====

// Extract a suitable image URL, preferring 3:2 ratio
const getImageUrl = (event: Event): string | undefined => {
  return (
    event.images?.find(img => img.ratio === '3_2')?.url ||
    event.images?.[0]?.url
  );
};

// Build classification string (e.g., Music • Rock • Alternative)
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
    flexDirection: 'row', // Layout image + text side by side
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2, // Shadow for Android
    overflow: 'hidden',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
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
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    marginTop: 2,
  },
  venue: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default EventCard;
