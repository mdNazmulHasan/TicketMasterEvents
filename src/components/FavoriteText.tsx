import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

interface Props {
  isFavorite: boolean;
  onPress: () => void;
}

const FavoriteText: React.FC<Props> = ({isFavorite, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        {backgroundColor: isFavorite ? '#ffe5e5' : '#e6f0ff'},
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.text, {color: isFavorite ? 'red' : 'blue'}]}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
    textDecorationLine: 'none',
  },
});

export default FavoriteText;
