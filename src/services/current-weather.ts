import "server-only";

import { owmClient } from "./owm-client";
import type { CurrentWeather, Units } from "@/types/weather";
import type { LocationCoordination } from "@/types/location";
import { BadGatewayError, NotFoundError } from "@/lib/errors";

interface GetCurrentWeatherParams extends LocationCoordination {
  units: Units;
}

export const getCurrentWeatherByCoord = async ({
  lat,
  lon,
  units,
}: GetCurrentWeatherParams): Promise<CurrentWeather> => {
  try {
    const response = await owmClient.request<CurrentWeather>(
      "/data/2.5/weather",
      { lat: lat.toString(), lon: lon.toString(), units },
      { revalidateSeconds: 500 },
    );

    return response;
  } catch (error) {
    if (error instanceof BadGatewayError && error.context?.statusCode === 400) {
      throw new NotFoundError("Location not found", {
        details: `Location at ${lat},${lon} not found`,
      });
    }
    throw error;
  }
};
