import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {EventsResponse, Event} from '../types/eventTypes';

// API key from environment variables with fallback to empty string
const API_KEY = process.env.TICKETMASTER_API_KEY ?? '';

// Interface for search events arguments
interface SearchEventsArgs {
  keyword: string;
  page?: number;
}

export const eventApi = createApi({
  // Unique redux store key for this api slice
  reducerPath: 'eventApi',
  // Configure base query with Ticketmaster API URL
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://app.ticketmaster.com/discovery/v2/',
  }),
  // Define API endpoints
  endpoints: builder => ({
    // Search events endpoint - returns array of events based on keyword
    searchEvents: builder.query<Event[], SearchEventsArgs>({
      // Configure request URL and parameters
      query: ({keyword, page = 0}) => ({
        url: 'events.json',
        params: {
          apikey: API_KEY,
          keyword,
          page,
          size: 20, // Number of results per page
          sort: 'date,asc', // Sort by date ascending
        },
      }),
      // Transform API response to extract just the events array
      transformResponse: (response: EventsResponse): Event[] =>
        response._embedded?.events ?? [],
    }),

    // Get details for a specific event by ID
    getEventDetails: builder.query<Event, string>({
      // Configure request with event ID in the URL path
      query: eventId => ({
        url: `events/${eventId}.json`,
        params: {
          apikey: API_KEY,
        },
      }),
    }),
  }),
});

// Export auto-generated hooks for use in components
export const {
  useSearchEventsQuery, // Automatically fetches when component mounts
  useLazySearchEventsQuery, // Manual trigger version of search query
  useGetEventDetailsQuery, // Hook for fetching event details
} = eventApi;
