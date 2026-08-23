import {
  BadGatewayError,
  NotFoundError,
  ServiceUnavailableError,
} from "@/lib/errors";
import { OWM_Location, Location } from "@/types/location";

const OWM_BASE_URL = "https://api.openweathermap.org";
const OWM_API_KEY = process.env.OPEN_WEATHER_API_KEY;

interface LocationSearchParams {
  query: {
    city: string;
    /** state code (US only)*/
    state?: string | null;
    /**ISO 3166 country code */
    country: string | null;
  };
  limit?: number;
}

export const searchLocations = async ({
  query,
  limit = 5,
}: LocationSearchParams): Promise<Location[]> => {
  if (!OWM_API_KEY) {
    throw new ServiceUnavailableError("Service is unavailable", {
      details: "OPEN_WEATHER_API_KEY not provided",
    });
  }

  const { city, state, country } = query;

  const parsedQuery = encodeURIComponent(
    [city, state, country].filter((item) => !!item).join(","),
  );

  const qs = new URLSearchParams({
    q: parsedQuery,
    limit: limit.toString(),
    appid: OWM_API_KEY,
  });

  const res = await fetch(`${OWM_BASE_URL}/geo/1.0/direct?${qs}`);

  if (!res.ok) {
    const erroData = await res.json();
    const errorDetail = erroData?.message || "Invalid request";
    throw new BadGatewayError("Failed to fetch location", {
      detail: errorDetail,
    });
  }

  const data = (await res.json()) as OWM_Location[];
  if (!data?.length) {
    throw new NotFoundError("No locations found");
  }

  const results: Location[] = data.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ local_names: _, ...loc }) => loc,
  );

  return results;
};
