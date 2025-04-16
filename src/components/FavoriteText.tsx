import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import useColors from '../styles/colors'; // Hook to get themed colors

interface Props {
  isFavorite: boolean; // Determines current favorite state
  onPress: () => void; // Callback when the button is pressed
}

const FavoriteText: React.FC<Props> = ({isFavorite, onPress}) => {
  const Colors = useColors(); // Get dynamic colors (based on theme)

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        {
          // Background changes based on favorite state
          backgroundColor: isFavorite ? Colors.favoriteBg : Colors.normalBg,
        },
        // Apply pressed style
        pressed && styles.pressed,
      ]}>
      <Text
        style={[
          styles.text,
          {
            // Text color also depends on favorite state
            color: isFavorite ? Colors.favoriteText : Colors.normalText,
          },
        ]}>
        {/* Button label changes based on state */}
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </Text>
    </Pressable>
  );
};

// Styles for the button and text
const styles = StyleSheet.create({
  button: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7, // Slight fade effect when pressed
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'none',
  },
});

export default FavoriteText;
