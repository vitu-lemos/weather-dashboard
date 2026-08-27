import "server-only";

import { owmClient } from "./owm-client";
import type {
  DailyForecast,
  OwmDailyForecastEntry,
  OwmForecastResponse,
  Units,
} from "@/types/weather";
import type { LocationCoordination } from "@/types/location";

interface GetForecastParams {
  coord: LocationCoordination;
  units: Units;
  limit?: number;
}

export function mapToDaily(
  entries: OwmDailyForecastEntry[],
  limit = 5,
): DailyForecast[] {
  return entries.slice(0, limit).map((entry, index) => ({
    dt: entry.dt,
    label:
      index === 0
        ? "Today"
        : new Date(entry.dt * 1000).toLocaleDateString("en-US", {
            weekday: "long",
            timeZone: "UTC",
          }),
    weather: entry.weather[0],
    pop: entry.pop,
    temp: {
      day: Math.round(entry.temp.day),
      min: Math.round(entry.temp.min),
      max: Math.round(entry.temp.max),
      night: Math.round(entry.temp.night),
      eve: Math.round(entry.temp.eve),
      morn: Math.round(entry.temp.morn),
    },
    feelsLike: {
      day: Math.round(entry.feels_like.day),
      night: Math.round(entry.feels_like.night),
      eve: Math.round(entry.feels_like.eve),
      morn: Math.round(entry.feels_like.morn),
    },
  }));
}

export const getDailyForecast = async ({
  coord,
  units,
  limit = 5,
}: GetForecastParams): Promise<DailyForecast[]> => {
  const data = await owmClient.request<OwmForecastResponse>(
    "/data/4.0/onecall/timeline/1day",
    {
      lat: coord.lat.toString(),
      lon: coord.lon.toString(),
      cnt: limit.toString(),
      units,
    },
    { revalidateSeconds: 300 },
  );

  return mapToDaily(data.data, limit);
};
