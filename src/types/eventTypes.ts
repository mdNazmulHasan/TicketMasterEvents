// Types for Venue details
export interface Venue {
  name: string; // Venue name (e.g., "Madison Square Garden")
  city: {
    name: string; // City name (e.g., "New York")
  };
  state?: {
    // Optional state information
    stateCode: string; // State code (e.g., "NY")
  };
  country: {
    countryCode: string; // Country code (e.g., "US")
  };
  location: Location; // Geographic coordinates
}

// Location coordinates
export interface Location {
  latitude: string; // Latitude as string (e.g., "40.7505")
  longitude: string; // Longitude as string (e.g., "-73.9934")
}

// Event classification details
export interface Classification {
  genre: {
    name: string; // Main genre (e.g., "Rock")
  };
  segment: {
    name: string; // Entertainment segment (e.g., "Music")
  };
  subGenre: {
    name: string; // More specific genre (e.g., "Alternative Rock")
  };
  type: {
    name: string; // Event type (e.g., "Concert")
  };
  subType: {
    name: string; // Event subtype (e.g., "Performance")
  };
}

// Ticket price information
export interface PriceRange {
  min: number; // Minimum ticket price
  max: number; // Maximum ticket price
}

// Date and time information
export interface DateInfo {
  localDate: string; // Event date in ISO format (e.g., "2025-05-12")
  localTime?: string; // Optional event time (e.g., "19:30:00")
}

// Event image information
export interface Image {
  url: string; // Image URL
  ratio?: string; // Optional aspect ratio (e.g., "16_9", "3_2")
}

// Main Event interface
export interface Event {
  id: string; // Unique event identifier
  name: string; // Event name/title
  description: string; // Event description
  url: string; // Ticketmaster URL for the event
  images: Image[]; // Array of event images
  dates: {
    start: DateInfo; // Event start date/time
  };
  _embedded?: {
    // Optional nested data
    venues?: Venue[]; // Array of venues (usually just one)
  };
  classifications?: Classification[]; // Event categories/genres
  priceRanges?: PriceRange[]; // Optional ticket price information
  info?: string; // Additional event information
}

// API response structure for event searches
export interface EventsResponse {
  _embedded?: {
    // Optional nested data
    events: Event[]; // Array of events matching the search
  };
  page?: {
    // Optional pagination information
    number: number; // Current page number
    totalPages: number; // Total number of pages available
  };
}
