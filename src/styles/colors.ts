import {useEffect, useState} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';

// Type definition for theme colors used throughout the app
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

// Light theme color palette
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

// Dark theme color palette
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

// Helper function to select colors based on color scheme
const getColors = (scheme: ColorSchemeName): ThemeColors =>
  scheme === 'dark' ? DarkColors : LightColors;

// Custom hook that provides theme colors and responds to system theme changes
const useColors = (): ThemeColors => {
  // Initialize state with current system color scheme
  const [colors, setColors] = useState<ThemeColors>(
    getColors(Appearance.getColorScheme()),
  );

  useEffect(() => {
    // Subscribe to system theme changes
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      // Update colors when system theme changes
      setColors(getColors(colorScheme));
    });

    // Clean up subscription when component unmounts
    return () => subscription.remove();
  }, []);

  return colors;
};

export default useColors;
