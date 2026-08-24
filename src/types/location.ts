import { WeatherCondition, WeatherMainMetrics } from "./weather";

export interface LocationCoordination {
  lat: number;
  lon: number;
}

export interface WindCondition {
  speed: number;
  deg: number;
}
export interface Location {
  id: number;
  name: string;
  coord: LocationCoordination;
  main: WeatherMainMetrics;
  /* Time of data calculation, unix, UTC */
  dt: number;
  wind: WindCondition;

  sys: {
    country: string;
  };
  clouds: {
    all: number;
  };
  weather: WeatherCondition[];
}

export interface OWM_LocationSearchResponse {
  message: string;
  cod: string;
  count: number;
  list: (Location & { rain: unknown | null; snow: unknown | null })[];
}
