import { afterEach, describe, expect, it, vi } from "vitest";

import { owmClient } from "./owm-client";
import type { CurrentWeather } from "@/types/weather";

const getCurrentWeatherByCoordMock = vi.fn();

vi.mock("./current-weather", () => ({
  getCurrentWeatherByCoord: (...args: unknown[]) =>
    getCurrentWeatherByCoordMock(...args),
}));

const { findLocations } = await import("./location-finder");

const geoLocation = (name: string, lat: number, lon: number, country: string) => ({
  name,
  lat,
  lon,
  country,
});

const currentWeather = (temp: number): CurrentWeather => ({
  name: "Jequié",
  id: 3459943,
  cod: 200,
  coord: { lat: -13.8586, lon: -40.0817 },
  dt: 1787577770,
  visibility: 10000,
  timezone: -10800,
  wind: { speed: 4.3, deg: 113, gust: 5 },
  clouds: { all: 10 },
  base: "stations",
  main: {
    temp,
    feels_like: temp,
    temp_min: temp,
    temp_max: temp,
    pressure: 1021,
    humidity: 54,
    sea_level: 1021,
    grnd_level: 947,
  },
  sys: { country: "BR", sunrise: 0, sunset: 0 },
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
});

describe("findLocations", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    getCurrentWeatherByCoordMock.mockReset();
  });

  it("maps the geocoding response merged with current weather to Location objects", async () => {
    const geo = geoLocation("Jequié", -13.8586, -40.0817, "BR");
    vi.spyOn(owmClient, "request").mockResolvedValue([geo]);
    const weather = currentWeather(22.89);
    getCurrentWeatherByCoordMock.mockResolvedValue(weather);

    const result = await findLocations({ city: "Jequié" });

    expect(result).toEqual([
      { ...geo, main: { temp: 22.89 }, weather: weather.weather },
    ]);
  });

  it("calls the geocoding endpoint with the search query and default params", async () => {
    const requestSpy = vi
      .spyOn(owmClient, "request")
      .mockResolvedValue([geoLocation("Chicago", 41.85, -87.65, "US")]);
    getCurrentWeatherByCoordMock.mockResolvedValue(currentWeather(10));

    await findLocations({ city: "Chicago" });

    expect(requestSpy).toHaveBeenCalledWith(
      "/geo/1.0/direct",
      { q: "Chicago", limit: "5" },
      { revalidateSeconds: 500 },
    );
  });

  it("lets a caller param override the default limit", async () => {
    const requestSpy = vi
      .spyOn(owmClient, "request")
      .mockResolvedValue([geoLocation("Chicago", 41.85, -87.65, "US")]);
    getCurrentWeatherByCoordMock.mockResolvedValue(currentWeather(10));

    await findLocations({ city: "Chicago", limit: 3, units: "imperial" });

    expect(requestSpy).toHaveBeenCalledWith(
      "/geo/1.0/direct",
      expect.objectContaining({ q: "Chicago", limit: "3" }),
      { revalidateSeconds: 500 },
    );
  });

  it("fetches current weather for each geocoding result using the given units", async () => {
    vi.spyOn(owmClient, "request").mockResolvedValue([
      geoLocation("Chicago", 41.85, -87.65, "US"),
    ]);
    getCurrentWeatherByCoordMock.mockResolvedValue(currentWeather(10));

    await findLocations({ city: "Chicago", units: "imperial" });

    expect(getCurrentWeatherByCoordMock).toHaveBeenCalledWith({
      lat: 41.85,
      lon: -87.65,
      units: "imperial",
    });
  });

  it("returns empty list when no locations are found", async () => {
    vi.spyOn(owmClient, "request").mockResolvedValue([]);

    const result = await findLocations({ city: "Nowhere" });
    expect(result).toEqual([]);
  });
});
