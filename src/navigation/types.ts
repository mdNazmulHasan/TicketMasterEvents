// src/navigation/types.ts
import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

// ===== Root Stack Navigator Types =====
export type RootStackParamList = {
  // 'Home' screen contains the Tab Navigator (nested)
  Home: NavigatorScreenParams<TabParamList>;

  // 'Detail' screen expects a string `id` parameter
  Detail: {id: string};
};

// ===== Bottom Tab Navigator Types =====
export type TabParamList = {
  Events: undefined; // No params needed for Events screen
  Favorites: undefined; // No params needed for Favorites screen
};

// ===== Generic Screen Prop Types =====
// Props for screens in the root stack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Props for screens in the tab navigator
export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;

// ===== Specific Typed Screen Props =====
// Props for Detail screen (includes `id` param)
export type DetailsScreenProps = RootStackScreenProps<'Detail'>;

// Props for Events screen (from Tab navigator)
export type EventsScreenProps = TabScreenProps<'Events'>;

// Props for Favorites screen (from Tab navigator)
export type FavoritesScreenProps = TabScreenProps<'Favorites'>;
