import React from 'react';
import AppNavigator from './navigation/AppNavigator';

/**
 * Main application component
 * Serves as the entry point for the React Native app
 * Renders the navigation structure defined in AppNavigator
 */
const App: React.FC = () => {
  return <AppNavigator />;
};

export default App;
