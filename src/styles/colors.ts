import {useEffect, useState} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';

type ThemeColors = {
  primary: string;
  inactive: string;
  background: string;
  text: string;
  subText: string;
  card: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  placeholder: string;
  favoriteBg: string;
  normalBg: string;
  favoriteText: string;
  normalText: string;
};

const LightColors: ThemeColors = {
  primary: 'tomato',
  inactive: 'gray',
  background: '#fff',
  text: '#000',
  subText: '#666',
  card: '#f8f8f8',
  border: '#e0e0e0',
  error: '#d32f2f',
  success: '#388e3c',
  warning: '#f57c00',
  info: '#1976d2',
  placeholder: '#ccc',
  favoriteBg: '#ffe5e5',
  normalBg: '#e6f0ff',
  favoriteText: 'red',
  normalText: 'blue',
};

const DarkColors: ThemeColors = {
  primary: 'tomato',
  inactive: '#888',
  background: '#121212',
  text: '#f0f0f0',
  subText: '#a0a0a0',
  card: '#1e1e1e',
  border: '#383838',
  error: '#f44336',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
  placeholder: '#555',
  favoriteBg: '#330000',
  normalBg: '#001a33',
  favoriteText: '#ff6666',
  normalText: '#6699ff',
};

const getColors = (scheme: ColorSchemeName): ThemeColors =>
  scheme === 'dark' ? DarkColors : LightColors;

const useColors = (): ThemeColors => {
  const [colors, setColors] = useState<ThemeColors>(
    getColors(Appearance.getColorScheme()),
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setColors(getColors(colorScheme));
    });

    return () => subscription.remove();
  }, []);

  return colors;
};

export default useColors;
