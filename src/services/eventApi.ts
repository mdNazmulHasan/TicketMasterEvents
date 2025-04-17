import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {EventsResponse, Event} from '../types/eventTypes';

// API key from environment variables with fallback to empty string
const API_KEY = process.env.TICKETMASTER_API_KEY ?? '';

// Interface for search events arguments
interface SearchEventsArgs {
  keyword: string;
  city?: string;
  page?: number;
}

export const eventApi = createApi({
  reducerPath: 'eventApi', // Unique redux store key for this api slice
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://app.ticketmaster.com/discovery/v2/', // Base URL for API
  }),
  endpoints: builder => ({
    // Search events endpoint - returns array of events based on keyword and city
    searchEvents: builder.query<Event[], SearchEventsArgs>({
      query: ({keyword, city, page = 0}) => ({
        url: 'events.json',
        params: {
          apikey: API_KEY,
          keyword,
          city,
          page,
          size: 20, // Number of results per page
          sort: 'date,asc', // Sort by date ascending
        },
      }),
      transformResponse: (response: EventsResponse): Event[] =>
        response._embedded?.events ?? [], // Return only events array
    }),

    // Get details for a specific event by ID
    getEventDetails: builder.query<Event, string>({
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
