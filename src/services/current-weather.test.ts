import { describe, expect, it, vi } from "vitest";
import { owmClient } from "./owm-client";
import { getCurrentWeatherByLocationId } from "./current-weather";
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

describe("getCurrentWeatherByLocationId", () => {
  it("calls the weather endpoint by id, with units and a 5-minute cache", async () => {
    const requestSpy = vi
      .spyOn(owmClient, "request")
      .mockResolvedValue(mockWeather);

    await getCurrentWeatherByLocationId({ id: 5128581, units: "metric" });

    expect(requestSpy).toHaveBeenCalledWith(
      "/data/2.5/weather",
      { id: "5128581", units: "metric" },
      { revalidateSeconds: 300 },
    );
  });

  it("returns the client's response as-is", async () => {
    vi.spyOn(owmClient, "request").mockResolvedValue(mockWeather);

    const result = await getCurrentWeatherByLocationId({
      id: 1,
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
      getCurrentWeatherByLocationId({ id: 9999999, units: "imperial" }),
    ).rejects.toMatchObject({ name: "NotFoundError", statusCode: 404 });
  });
});
