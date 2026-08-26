import { CountryCode, LocationCoordination } from "./location";

export type Units = "imperial" | "metric";

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

export interface DailyForecast {
  dt: number;
  label: string;
  weather: WeatherCondition;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feelsLike: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
}

export interface OwmDailyForecastEntry {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  weather: WeatherCondition[];
}

export interface OwmForecastResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  data: OwmDailyForecastEntry[];
}
