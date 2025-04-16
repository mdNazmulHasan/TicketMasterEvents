import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native'; // Navigation setup with theming support
import {useColorScheme} from 'react-native'; // Detect system light/dark mode
import RootNavigator from './RootNavigator'; // App's main navigator
import {Provider} from 'react-redux'; // Redux provider for global state
import {store} from '../store/store'; // Redux store

const AppNavigator: React.FC = () => {
  const colorScheme = useColorScheme(); // Get current system color scheme
  const isDarkMode = colorScheme === 'dark'; // Determine if dark mode is active
  const theme = isDarkMode ? DarkTheme : DefaultTheme; // Choose theme based on system setting

  return (
    // Make Redux store available throughout the app
    <Provider store={store}>
      {/* Set up navigation container with appropriate theme */}
      <NavigationContainer theme={theme}>
        {/* Main navigator of the app */}
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default AppNavigator;
