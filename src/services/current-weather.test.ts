import { afterEach, describe, expect, it, vi } from "vitest";
import { owmClient } from "./owm-client";
import { getCurrentWeatherByCoord } from "./current-weather";
import type { CurrentWeather } from "@/types/weather";
import { BadGatewayError } from "@/lib/errors";

const mockWeather: CurrentWeather = {
  coord: {
    lon: -74.006,
    lat: 40.7143,
  },
  weather: [
    {
      id: 801,
      main: "Clouds",
      description: "few clouds",
      icon: "02d",
    },
  ],
  base: "stations",
  main: {
    temp: 298.37,
    feels_like: 298.33,
    temp_min: 296.14,
    temp_max: 299.9,
    pressure: 1014,
    humidity: 53,
    sea_level: 1014,
    grnd_level: 1012,
  },
  visibility: 10000,
  wind: {
    speed: 6.17,
    deg: 240,
    gust: 8.75,
  },
  clouds: {
    all: 18,
  },
  dt: 1787584248,
  sys: {
    type: 1,
    id: 4610,
    country: "US",
    sunrise: 1787566520,
    sunset: 1787614912,
  },
  timezone: -14400,
  id: 5128581,
  name: "New York",
  cod: 200,
};

describe("getCurrentWeatherByCoord", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the weather endpoint by coord, with units and a 500-second cache", async () => {
    const requestSpy = vi
      .spyOn(owmClient, "request")
      .mockResolvedValue(mockWeather);

    await getCurrentWeatherByCoord({
      lat: 40.7143,
      lon: -74.006,
      units: "metric",
    });

    expect(requestSpy).toHaveBeenCalledWith(
      "/data/2.5/weather",
      { lat: "40.7143", lon: "-74.006", units: "metric" },
      { revalidateSeconds: 500 },
    );
  });

  it("returns the client's response as-is", async () => {
    vi.spyOn(owmClient, "request").mockResolvedValue(mockWeather);

    const result = await getCurrentWeatherByCoord({
      lat: 1,
      lon: 1,
      units: "imperial",
    });

    expect(result).toBe(mockWeather);
  });
  it("return 404 when the location is not found", async () => {
    vi.spyOn(owmClient, "request").mockRejectedValue(
      new BadGatewayError("Failed to fetch weather data", {
        detail: "city not found",
        statusCode: 400,
      }),
    );

    await expect(
      getCurrentWeatherByCoord({ lat: 99, lon: 99, units: "imperial" }),
    ).rejects.toMatchObject({ name: "NotFoundError", statusCode: 404 });
  });
});
