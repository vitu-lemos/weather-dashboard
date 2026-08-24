import { APP_UNITS } from "@/constants";
import { CountryCode, LocationCoordination } from "./location";

export type Units = keyof typeof APP_UNITS;

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMainMetrics {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  /** Atmospheric pressure on the sea level, hPa */
  sea_level: number;
  /** Atmospheric pressure on the ground level, hPa */
  grnd_level: number;
}

export interface CurrentWeather {
  /** City name */
  name: string;
  /** City ID */
  id: number;
  cod: number;
  coord: LocationCoordination;
  /* Time of data calculation, unix, UTC */
  dt: number;
  /*Visibility, meter only. */
  visibility: number;
  /** Shift in seconds from UTC */
  timezone: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  base: string;
  main: WeatherMainMetrics;
  sys: {
    id?: number;
    type?: number;
    country: CountryCode;
    /** Sunrise time, unix, UTC */
    sunrise: number;
    /** Sunset time, unix, UTC */
    sunset: number;
  };
  weather: WeatherCondition[];
}
