import "server-only";

import { BadGatewayError, ServiceUnavailableError } from "@/lib/errors";
import { OWM_API_KEY, OWM_BASE_URL } from "@/server-constants";

interface ClientConfig {
  baseUrl: string;
  apiKey: string | undefined;
}

interface RequestOptions {
  revalidateSeconds?: number;
}

const DEFAULT_PARAMS = {
  units: "metric",
  lang: "en",
} as const;

export class OpenWeatherMapApiClient {
  constructor(private readonly config: ClientConfig) {}

  async request<T>(
    path: string,
    params: Record<string, string>,
    options: RequestOptions = {},
  ): Promise<T> {
    const { apiKey, baseUrl } = this.config;

    if (!apiKey) {
      throw new ServiceUnavailableError("Service is unavailable", {
        details: "OPEN_WEATHER_API_KEY not provided",
      });
    }

    const mergedParams = Object.assign(
      { units: DEFAULT_PARAMS.units, lang: DEFAULT_PARAMS.lang },
      params,
      { appid: apiKey },
    );

    const qs = new URLSearchParams(mergedParams);

    const init: RequestInit & { next?: { revalidate: number } } = {};
    if (options.revalidateSeconds !== undefined) {
      init.next = { revalidate: options.revalidateSeconds };
    }

    const res = await fetch(`${baseUrl}${path}?${qs}`, init);

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const errorDetail = errorData?.message || "Invalid request";
      throw new BadGatewayError("Failed to fetch weather data", {
        detail: errorDetail,
      });
    }

    return res.json() as Promise<T>;
  }
}

export const owmClient = new OpenWeatherMapApiClient({
  baseUrl: OWM_BASE_URL,
  apiKey: OWM_API_KEY,
});
