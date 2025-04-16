export interface Venue {
  name: string;
  city: {
    name: string;
  };
  state?: {
    stateCode: string;
  };
  country: {
    countryCode: string;
  };
  location: Location;
}
export interface Location {
  latitude: string; // or number depending on your use case
  longitude: string; // or number
}

export interface Classification {
  genre: {
    name: string;
  };
  segment: {
    name: string;
  };
  subGenre: {
    name: string;
  };
  type: {
    name: string;
  };
  subType: {
    name: string;
  };
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface DateInfo {
  localDate: string;
  localTime?: string;
}

export interface Image {
  url: string;
  ratio?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  url: string;
  images: Image[];
  dates: {
    start: DateInfo;
  };
  _embedded?: {
    venues?: Venue[];
  };
  classifications?: Classification[];
  priceRanges?: PriceRange[];
  info?: string;
}

export interface EventsResponse {
  _embedded?: {
    events: Event[];
  };
  page?: {
    number: number;
    totalPages: number;
  };
}
