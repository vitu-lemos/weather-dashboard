import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HourlyForecastList } from "./HourlyForecastList";
import type { HourlyForecast } from "@/types/weather";

function hour(hourUTC: number, temp: number): HourlyForecast {
  return {
    dt: Math.floor(Date.UTC(2026, 7, 20, hourUTC, 0, 0) / 1000),
    weather: { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    temp,
    pop: 0.3,
  };
}

const hourly: HourlyForecast[] = [
  hour(14, 23),
  hour(15, 24),
  hour(16, 22),
];

describe("HourlyForecastList", () => {
  it("renders an hourly card for each entry under the given title", () => {
    render(
      <HourlyForecastList hourly={hourly} timezone={0} title="Hourly Forecast" />,
    );

    expect(screen.getByText("Hourly Forecast")).toBeTruthy();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });
});
