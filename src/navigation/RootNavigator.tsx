import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack'; // Native stack navigation
import {RootStackParamList} from './types'; // Type definitions for stack screens
import TabNavigator from './TabNavigator'; // Bottom tab navigator component
import DetailsScreen from '../screens/DetailsScreen'; // Details screen component

// Create a typed stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    // Stack navigator for managing screen transitions
    <Stack.Navigator
      screenOptions={{
        animation: 'fade', // Global screen transition animation
      }}>
      {/* Main app screen with bottom tabs, no header shown */}
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{headerShown: false}}
      />

      {/* Detail screen with card presentation and fade animation */}
      <Stack.Screen
        name="Detail"
        component={DetailsScreen}
        options={{
          presentation: 'card',
          animation: 'fade',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
