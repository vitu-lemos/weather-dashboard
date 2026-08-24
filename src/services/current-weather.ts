import "server-only";

import { owmClient } from "./owm-client";
import type { CurrentWeather, Units } from "@/types/weather";
import { BadGatewayError, NotFoundError } from "@/lib/errors";

interface GetCurrentWeatherParams {
  id: number;
  units: Units;
}

export const getCurrentWeatherByLocationId = async ({
  id,
  units,
}: GetCurrentWeatherParams): Promise<CurrentWeather> => {
  try {
    const response = await owmClient.request<CurrentWeather>(
      "/data/2.5/weather",
      { id: id.toString(), units },
      { revalidateSeconds: 300 },
    );

    return response;
  } catch (error) {
    if (error instanceof BadGatewayError && error.context?.statusCode === 400) {
      throw new NotFoundError("Location not found", {
        details: `Location with ID ${id} not found`,
      });
    }
    throw error;
  }
};
