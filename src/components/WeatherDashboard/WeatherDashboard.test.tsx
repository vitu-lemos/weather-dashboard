import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NotFoundError, BadGatewayError } from "@/lib/errors";
import type { CurrentWeather, DailyForecast } from "@/types/weather";

const notFoundMock = vi.fn();
const getCurrentWeatherByLocationIdMock = vi.fn();
const getDailyForecastMock = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

vi.mock("@/services/current-weather", () => ({
  getCurrentWeatherByLocationId: (...args: unknown[]) =>
    getCurrentWeatherByLocationIdMock(...args),
}));

vi.mock("@/services/forecast", () => ({
  getDailyForecast: (...args: unknown[]) => getDailyForecastMock(...args),
}));

const { WeatherDashboard } = await import("./WeatherDashboard");

function buildCurrentWeather(): CurrentWeather {
  return {
    name: "New York",
    id: 5128581,
    cod: 200,
    coord: { lon: -74.006, lat: 40.7143 },
    dt: 1_700_000_000,
    visibility: 10000,
    timezone: -14400,
    wind: { speed: 3.5, deg: 180, gust: 5 },
    clouds: { all: 20 },
    base: "stations",
    main: {
      temp: 21.6,
      feels_like: 21.2,
      temp_min: 19,
      temp_max: 23,
      pressure: 1015,
      humidity: 60,
      sea_level: 1015,
      grnd_level: 1010,
    },
    sys: { country: "US", sunrise: 1_699_960_000, sunset: 1_700_003_000 },
    weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
  };
}

function buildForecast(): DailyForecast[] {
  return [
    {
      dt: 1_700_000_000,
      label: "Today",
      weather: { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
      pop: 0.5,
      temp: { day: 22, min: 19, max: 24, night: 18, eve: 21, morn: 17 },
      feelsLike: { day: 22, night: 18, eve: 21, morn: 17 },
    },
  ];
}

describe("WeatherDashboard", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the current weather and forecast on success", async () => {
    getCurrentWeatherByLocationIdMock.mockResolvedValue(buildCurrentWeather());
    getDailyForecastMock.mockResolvedValue(buildForecast());

    render(await WeatherDashboard({ locationId: 5128581, units: "metric" }));

    expect(screen.getByText("New York, US")).toBeTruthy();
    expect(screen.getByText("5-Day Forecast")).toBeTruthy();
  });

  it("calls notFound when the location does not exist", async () => {
    getCurrentWeatherByLocationIdMock.mockRejectedValue(
      new NotFoundError("Location not found"),
    );
    getDailyForecastMock.mockResolvedValue(buildForecast());

    render(await WeatherDashboard({ locationId: 9999999, units: "metric" }));

    expect(notFoundMock).toHaveBeenCalled();
  });

  it("renders an error message when the current weather fetch fails", async () => {
    getCurrentWeatherByLocationIdMock.mockRejectedValue(
      new BadGatewayError("Weather service error."),
    );
    getDailyForecastMock.mockResolvedValue(buildForecast());

    render(await WeatherDashboard({ locationId: 5128581, units: "metric" }));

    expect(screen.getByText("Failed to load city weather")).toBeTruthy();
  });

  it("renders the current weather without a forecast sidebar when the forecast fetch fails", async () => {
    getCurrentWeatherByLocationIdMock.mockResolvedValue(buildCurrentWeather());
    getDailyForecastMock.mockRejectedValue(new Error("boom"));

    render(await WeatherDashboard({ locationId: 5128581, units: "metric" }));

    expect(screen.getByText("New York, US")).toBeTruthy();
    expect(screen.queryByText("5-Day Forecast")).toBeNull();
  });
});
