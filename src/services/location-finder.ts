import "server-only";

import type { Location, OwmGeocodingResponse } from "@/types/location";
import type { Units } from "@/types/weather";

import { owmClient } from "./owm-client";
import { getCurrentWeatherByCoord } from "./current-weather";

interface FindLocationsParams {
  city: string;
  units?: Units;
  limit?: number;
}

export const findLocations = async ({
  city,
  units = "metric",
  limit = 5,
}: FindLocationsParams): Promise<Location[]> => {
  const geoLocations = await owmClient.request<OwmGeocodingResponse>(
    "/geo/1.0/direct",
    { q: city, limit: limit.toString() },
    { revalidateSeconds: 500 },
  );

  return Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    geoLocations.map(async ({ local_names, ...geoLocation }) => {
      const weather = await getCurrentWeatherByCoord({
        lat: geoLocation.lat,
        lon: geoLocation.lon,
        units,
      });

      return {
        ...geoLocation,
        main: { temp: weather.main.temp },
        weather: weather.weather,
      };
    }),
  );
};
