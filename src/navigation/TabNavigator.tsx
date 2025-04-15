// src/navigation/TabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabParamList} from './types';
import Colors from '../styles/colors';
import EventsScreen from '../screens/EventsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          paddingBottom: 5,
        },
        tabBarStyle: {
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{title: 'Events'}}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{title: 'Favorites'}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
