import {Appearance} from 'react-native';

const colorScheme = Appearance.getColorScheme();

const LightColors = {
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
};

const DarkColors = {
  primary: 'tomato', // Keeping the same primary color
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
};

const Colors = colorScheme === 'dark' ? DarkColors : LightColors;

export default Colors;
