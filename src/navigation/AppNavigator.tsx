import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import RootNavigator from './RootNavigator';
import {Provider} from 'react-redux';
import {store} from '../store/store';

const AppNavigator: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? DarkTheme : DefaultTheme;
  return (
    <Provider store={store}>
      <NavigationContainer theme={theme}>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default AppNavigator;
