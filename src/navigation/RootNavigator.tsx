import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import TabNavigator from './TabNavigator';
import DetailsScreen from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Detail" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
