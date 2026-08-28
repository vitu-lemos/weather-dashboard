import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HourlyForecastCard } from "./HourlyForecastCard";
import type { HourlyForecast } from "@/types/weather";

function buildHour(overrides: Partial<HourlyForecast> = {}): HourlyForecast {
  return {
    dt: Math.floor(Date.UTC(2026, 7, 20, 14, 0, 0) / 1000),
    weather: { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    temp: 23.4,
    pop: 0.4,
    ...overrides,
  };
}

describe("HourlyForecastCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the local time, temperature, and rain chance", () => {
    render(<HourlyForecastCard hour={buildHour()} timezone={0} />);

    expect(screen.getByText("2 PM")).toBeTruthy();
    expect(screen.getByText("23°")).toBeTruthy();
    expect(screen.getByText("40%")).toBeTruthy();
  });

  it("shifts the displayed time by the location timezone offset", () => {
    render(<HourlyForecastCard hour={buildHour()} timezone={-14400} />);

    expect(screen.getByText("10 AM")).toBeTruthy();
  });
});
