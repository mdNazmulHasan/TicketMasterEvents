// src/navigation/TabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'; // Bottom tab navigator
import {TabParamList} from './types'; // Type definitions for tab screens
import EventsScreen from '../screens/EventsScreen'; // Events screen component
import FavoritesScreen from '../screens/FavoritesScreen'; // Favorites screen component
import useColors from '../styles/colors'; // Hook to get theme-based colors

// Create a typed bottom tab navigator
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const Colors = useColors(); // Get color palette based on theme

  return (
    // Set up the bottom tab navigator
    <Tab.Navigator
      screenOptions={{
        tabBarIcon: () => null, // Hide default icons (optional)
        tabBarActiveTintColor: Colors.primary, // Color for active tab label
        tabBarInactiveTintColor: Colors.inactive, // Color for inactive tab label
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          marginTop: -20, // Remove padding
        },
        tabBarStyle: {
          height: 60, // Height of the bottom tab bar
          justifyContent: 'center', // Center vertically
          alignItems: 'center', // Center horizontally (optional)
        },
        tabBarItemStyle: {
          justifyContent: 'center', // Center each item
          alignItems: 'center',
        },
      }}>
      {/* Tab for Events screen */}
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{title: 'Events'}}
      />

      {/* Tab for Favorites screen */}
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{title: 'Favorites'}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
