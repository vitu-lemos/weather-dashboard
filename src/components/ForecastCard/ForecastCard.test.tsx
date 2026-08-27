import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ForecastCard } from "./ForecastCard";
import type { DailyForecast } from "@/types/weather";

const TEMP = { day: 75, min: 69, max: 81, night: 70, eve: 76, morn: 68 };
const FEELS_LIKE = { day: 75, night: 70, eve: 76, morn: 68 };

function buildDay(overrides: Partial<DailyForecast> = {}): DailyForecast {
  return {
    dt: 1787616000,
    label: "Friday",
    weather: { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    pop: 0.426,
    temp: TEMP,
    feelsLike: FEELS_LIKE,
    ...overrides,
  };
}

describe("ForecastCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the card with the correct content", () => {
    render(<ForecastCard day={buildDay()} />);

    expect(screen.getByText("Friday")).toBeTruthy();
    expect(screen.getByText("L 69°")).toBeTruthy();
    expect(screen.getByText("H 81°")).toBeTruthy();
    expect(screen.getByText("43%")).toBeTruthy();
  });
});
