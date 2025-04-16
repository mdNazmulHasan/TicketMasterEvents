import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {EventsResponse, Event} from '../types/eventTypes';

const API_KEY = process.env.TICKETMASTER_API_KEY ?? '';

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
    searchEvents: builder.query<Event[], SearchEventsArgs>({
      query: ({keyword, page = 0}) => ({
        url: 'events.json',
        params: {
          apikey: API_KEY,
          keyword,
          page,
          size: 20,
          sort: 'date,asc',
        },
      }),
      transformResponse: (response: EventsResponse): Event[] =>
        response._embedded?.events ?? [],
    }),

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
