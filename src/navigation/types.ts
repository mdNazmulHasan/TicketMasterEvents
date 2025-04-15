// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Main stack param list
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>; // Contains the tab navigator
  Detail: { id: string }; // Detail screen with required id parameter
};

// Tab navigator param list
export type TabParamList = {
  Events: undefined;
  Favorites: undefined;
};

// Screen props types
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  BottomTabScreenProps<TabParamList, T>;

// Specific screen props
export type DetailsScreenProps = RootStackScreenProps<'Detail'>;
export type EventsScreenProps = TabScreenProps<'Events'>;
export type FavoritesScreenProps = TabScreenProps<'Favorites'>;