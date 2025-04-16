import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import useColors from '../styles/colors';

interface Props {
  isFavorite: boolean;
  onPress: () => void;
}

const FavoriteText: React.FC<Props> = ({isFavorite, onPress}) => {
  const Colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        {backgroundColor: isFavorite ? Colors.favoriteBg : Colors.normalBg},
        pressed && styles.pressed,
      ]}>
      <Text
        style={[
          styles.text,
          {color: isFavorite ? Colors.favoriteText : Colors.normalText},
        ]}>
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
