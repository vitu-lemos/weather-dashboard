import { WeatherCondition } from "./weather";

export interface LocationCoordination {
  lat: number;
  lon: number;
}
/** Country code (ISO 3166-1 alpha-2 - US, JP, BR) */
export type CountryCode = string;

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: CountryCode;
  state?: string;
}

export interface Location extends GeoLocation {
  main: { temp: number };
  weather: WeatherCondition[];
}

export type OwmGeocodingResponse = Array<
  GeoLocation & { local_names?: Record<string, string> }
>;
