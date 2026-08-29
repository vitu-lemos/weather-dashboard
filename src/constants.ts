import { Units } from "./types/weather";

export const APP_UNITS: { [key: string]: { unit: Units; symbol: string } } = {
  metric: {
    unit: "metric",
    symbol: "°C",
  },
  imperial: {
    unit: "imperial",
    symbol: "°F",
  },
};

export const DEFAULT_APP_UNIT = APP_UNITS.metric;
export const DEFAULT_LOCATION_COORD = { lat: 40.7127281, lon: -74.0060152 }; // New York
