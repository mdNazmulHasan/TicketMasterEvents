import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import {Provider} from 'react-redux';
import {store} from '../store/store';

const AppNavigator: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default AppNavigator;
