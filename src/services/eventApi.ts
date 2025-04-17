import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {EventsResponse, Event} from '../types/eventTypes';

const API_KEY = process.env.TICKETMASTER_API_KEY ?? '';

// Input type for search query
interface SearchEventsArgs {
  keyword: string;
  page?: number;
}

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://app.ticketmaster.com/discovery/v2/',
  }),
  endpoints: builder => ({
    // Search events
    searchEvents: builder.query<Event[], SearchEventsArgs>({
      query: ({keyword, page = 0}) => {
        const params: Record<string, any> = {
          apikey: API_KEY,
          page,
          size: 20,
          sort: 'date,desc',
        };

        if (keyword.trim()) {
          params.keyword = keyword.trim();
        }

        return {
          url: 'events.json',
          params,
        };
      },
      transformResponse: (response: EventsResponse): Event[] =>
        response._embedded?.events ?? [],
    }),

    // Get event details by ID
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

export const {
  useSearchEventsQuery,
  useLazySearchEventsQuery,
  useGetEventDetailsQuery,
} = eventApi;
