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
