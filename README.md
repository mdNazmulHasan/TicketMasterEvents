# Event Finder App

A React Native mobile application for discovering and saving your favorite events using the Ticketmaster API.

## Screenshots

<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <img src="https://prnt.sc/Zbc3f6hTaB6m" alt="Events Screen" width="180" />
  <img src="/api/placeholder/180/360" alt="Search Results" width="180" />
  <img src="/api/placeholder/180/360" alt="Event Details" width="180" />
  <img src="/api/placeholder/180/360" alt="Favorites Screen" width="180" />
</div>

## Features

- **Event Discovery**: Search for events by keyword
- **Event Details**: View comprehensive information about each event
- **Favorites System**: Save your favorite events for quick access
- **Dark Mode Support**: Automatic theme switching based on device settings
- **Responsive Design**: Works on various screen sizes

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **TypeScript**: For type safety and better developer experience
- **Redux Toolkit**: State management with RTK Query for API calls
- **React Navigation**: Navigation between screens
- **MMKV Storage**: High-performance key-value storage
- **Ticketmaster API**: Event data source

## Project Structure

```
src/
├── components/         # Reusable UI components
├── navigation/         # Navigation configuration
├── screens/            # Application screens
├── services/           # API services using RTK Query
├── store/              # Redux store setup
├── styles/             # Theme and style utilities
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and utilities
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- React Native development environment
- Ticketmaster API Key

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-finder-app.git
   cd event-finder-app
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory with your Ticketmaster API key:
   ```
   TICKETMASTER_API_KEY=your_api_key_here
   ```

### Running the App

#### iOS

```bash
# Install pods
npx pod-install ios

# Run on iOS simulator
npx react-native run-ios
```

#### Android

```bash
# Run on Android emulator or connected device
npx react-native run-android
```

## Design Decisions

### State Management

I chose Redux Toolkit with RTK Query for several reasons:

1. **Centralized API Logic**: RTK Query handles caching, loading states, and error handling.
2. **Reduced Boilerplate**: Fewer lines of code compared to traditional Redux.
3. **TypeScript Integration**: Excellent type safety throughout the data flow.

### Storage Solution

MMKV was selected over AsyncStorage because:

1. **Performance**: Much faster reading and writing of data.
2. **Type Safety**: Better integration with TypeScript.
3. **Bundle Size**: Smaller impact on the app's size.

### Theme System

The app includes a custom theme system that:

1. **Responds to System Changes**: Automatically adapts between light and dark mode.
2. **Consistent Color Palette**: Ensures visual harmony throughout the app.
3. **Accessibility**: Maintains good contrast ratios in both theme modes.

### Navigation Architecture

React Navigation v6 was implemented with:

1. **Tab-based Main Flow**: Easy access to discover and favorites sections.
2. **Stack Navigation**: Proper history management when viewing event details.
3. **Type Safety**: Full TypeScript support for navigation props.

## Future Improvements

- Add location-based event discovery
- Implement user authentication
- Add calendar integration for saved events
- Create push notifications for upcoming favorited events
- Add ticket purchasing through deep linking

## Demo Video

[Watch the demo video](https://example.com/demo-video)

## License

MIT © [Your Name]

## Acknowledgements

- [Ticketmaster API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) for providing event data
- [React Native Community](https://reactnative.dev/) for the amazing framework and tools