import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ForecastList } from "./ForecastList";
import type { DailyForecast } from "@/types/weather";

const TEMP = { day: 75, min: 69, max: 81, night: 70, eve: 76, morn: 68 };
const FEELS_LIKE = { day: 75, night: 70, eve: 76, morn: 68 };

function day(
  label: string,
  icon: string,
  min: number,
  max: number,
): DailyForecast {
  return {
    dt: 1787616000,
    label,
    weather: { id: 800, main: "Clear", description: "clear sky", icon },
    pop: 0.3,
    temp: { ...TEMP, min, max },
    feelsLike: FEELS_LIKE,
  };
}

const forecast: DailyForecast[] = [
  day("Today", "01d", 69, 81),
  day("Tuesday", "03d", 68, 79),
  day("Wednesday", "10d", 65, 74),
  day("Thursday", "01d", 66, 77),
  day("Friday", "11d", 63, 72),
];

describe("ForecastList", () => {
  it("renders 5 forecast cards with the correct day labels", () => {
    render(<ForecastList forecast={forecast} title="5-Day Forecast" />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(5);

    for (const day of forecast) {
      expect(screen.getByText(day.label)).toBeDefined();
    }
  });
});
