import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CurrentWeather } from "./CurrentWeather";
import type { CurrentWeather as CurrentWeatherData } from "@/types/weather";

function buildCurrentWeather(
  overrides: Partial<CurrentWeatherData> = {},
): CurrentWeatherData {
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
    sys: {
      country: "US",
      sunrise: 1_699_960_000,
      sunset: 1_700_003_000,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    ...overrides,
  };
}

describe("CurrentWeather", () => {
  it("renders the current weather with correct fields", () => {
    const { container, getByText, getByRole } = render(
      <CurrentWeather current={buildCurrentWeather()} />,
    );

    expect(
      getByRole("region", { name: "Current weather in New York, US" }),
    ).toBeTruthy();
    expect(getByText("New York, US")).toBeTruthy();
    expect(getByText("22°")).toBeTruthy();
    expect(getByText("clear sky")).toBeTruthy();

    const icon = container.querySelector("i");
    expect(icon?.className).toContain("wi-owm-day-800");
  });

  it("rounds the temperature to the nearest degree", () => {
    const { getByText } = render(
      <CurrentWeather
        current={buildCurrentWeather({
          main: {
            temp: 19.4,
            feels_like: 19,
            temp_min: 18,
            temp_max: 20,
            pressure: 1015,
            humidity: 60,
            sea_level: 1015,
            grnd_level: 1010,
          },
        })}
      />,
    );

    expect(getByText("19°")).toBeTruthy();
  });

  it("renders the night variant when the icon code includes 'n'", () => {
    const { container } = render(
      <CurrentWeather
        current={buildCurrentWeather({
          weather: [
            {
              id: 800,
              main: "Clear",
              description: "clear sky",
              icon: "01n",
            },
          ],
        })}
      />,
    );

    const icon = container.querySelector("i");
    expect(icon?.className).toContain("wi-owm-night-800");
  });
});
