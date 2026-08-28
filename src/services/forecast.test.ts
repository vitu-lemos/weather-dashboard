import { afterEach, describe, expect, it, vi } from "vitest";
import { owmClient } from "./owm-client";
import {
  getDailyForecast,
  mapToDaily,
  getHourlyForecast,
  mapToHourly,
} from "./forecast";
import type {
  OwmDailyForecastEntry,
  OwmHourlyForecastEntry,
} from "@/types/weather";

function entry(
  isoDateUTC: string,
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  },
  feelsLike: { day: number; night: number; eve: number; morn: number },
  icon: string,
  pop = 0.4,
): OwmDailyForecastEntry {
  return {
    dt: Math.floor(new Date(isoDateUTC).getTime() / 1000),
    temp,
    feels_like: feelsLike,
    weather: [{ icon, description: "clear sky", main: "Clear", id: 800 }],
    pop,
  };
}

const TEMP = {
  day: 63.4,
  min: 60.4,
  max: 65.6,
  night: 58.2,
  eve: 64.1,
  morn: 59.9,
};
const FEELS_LIKE = { day: 62.9, night: 57.6, eve: 63.5, morn: 59.3 };

describe("mapToDaily", () => {
  it("maps oWM response to DailyForecast format", () => {
    const entries = [entry("2026-08-20", TEMP, FEELS_LIKE, "01d")];

    const result = mapToDaily(entries);

    expect(result).toEqual([
      {
        dt: Math.floor(new Date("2026-08-20").getTime() / 1000),
        label: "Today",
        weather: {
          icon: "01d",
          description: "clear sky",
          main: "Clear",
          id: 800,
        },
        pop: 0.4,
        temp: { day: 63, min: 60, max: 66, night: 58, eve: 64, morn: 60 },
        feelsLike: { day: 63, night: 58, eve: 64, morn: 59 },
      },
    ]);
  });

  it("labels entries after the first by weekday name", () => {
    const entries = [
      entry("2026-08-20", TEMP, FEELS_LIKE, "01d"),
      entry("2026-08-21", TEMP, FEELS_LIKE, "10d"),
    ];

    const result = mapToDaily(entries);

    expect(result[1].label).toBe("Friday");
  });

  it("uses only the first weather condition when the API returns more than one", () => {
    const withExtraCondition: OwmDailyForecastEntry = {
      ...entry("2026-08-20", TEMP, FEELS_LIKE, "01d"),
      weather: [
        { icon: "01d", description: "clear sky", main: "Clear", id: 800 },
        { icon: "50d", description: "mist", main: "Mist", id: 701 },
      ],
    };

    const result = mapToDaily([withExtraCondition]);

    expect(result[0].weather).toEqual({
      icon: "01d",
      description: "clear sky",
      main: "Clear",
      id: 800,
    });
  });

  it("returns an empty array for empty entries", () => {
    expect(mapToDaily([])).toEqual([]);
  });

  it("caps result to 5 days by default", () => {
    const entries = Array.from({ length: 7 }, (_, i) =>
      entry(`2026-08-${20 + i}`, TEMP, FEELS_LIKE, "01d"),
    );

    const result = mapToDaily(entries);

    expect(result).toHaveLength(5);
  });

  it("respects a custom limit", () => {
    const entries = Array.from({ length: 7 }, (_, i) =>
      entry(`2026-08-${20 + i}`, TEMP, FEELS_LIKE, "01d"),
    );

    const result = mapToDaily(entries, 3);

    expect(result).toHaveLength(3);
  });
});

describe("mapToDaily timezone handling", () => {
  const originalTZ = process.env.TZ;

  afterEach(() => {
    process.env.TZ = originalTZ;
  });

  it("labels weekday from the UTC calendar day, not the host runtime timezone", () => {
    process.env.TZ = "America/Sao_Paulo";

    const entries = [
      entry("2026-08-25T00:00:00Z", TEMP, FEELS_LIKE, "01d"),
      entry("2026-08-26T00:00:00Z", TEMP, FEELS_LIKE, "01d"),
    ];

    const result = mapToDaily(entries);

    expect(result[1].label).toBe("Wednesday");
  });
});

describe("getDailyForecast", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the onecall timeline endpoint with lat/lon/cnt, returning the mapped result", async () => {
    const requestSpy = vi.spyOn(owmClient, "request").mockResolvedValue({
      lat: 40.7127,
      lon: -74.0103,
      timezone: "America/New_York",
      timezone_offset: -14400,
      data: [entry("2026-08-20", TEMP, FEELS_LIKE, "01d")],
    });

    const result = await getDailyForecast({
      coord: { lat: 40.7127, lon: -74.0103 },
      units: "metric",
    });

    expect(requestSpy).toHaveBeenCalledWith(
      "/data/4.0/onecall/timeline/1day",
      { lat: "40.7127", lon: "-74.0103", cnt: "5", units: "metric" },
      { revalidateSeconds: 300 },
    );
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Today");
  });

  it("forwards a custom limit to both the request cnt and the mapped result length", async () => {
    const requestSpy = vi.spyOn(owmClient, "request").mockResolvedValue({
      lat: 40.7127,
      lon: -74.0103,
      timezone: "America/New_York",
      timezone_offset: -14400,
      data: Array.from({ length: 5 }, (_, i) =>
        entry(`2026-08-${20 + i}`, TEMP, FEELS_LIKE, "01d"),
      ),
    });
    const result = await getDailyForecast({
      coord: { lat: 40.7127, lon: -74.0103 },
      units: "metric",
      limit: 3,
    });

    expect(requestSpy).toHaveBeenCalledWith(
      "/data/4.0/onecall/timeline/1day",
      { lat: "40.7127", lon: "-74.0103", cnt: "3", units: "metric" },
      { revalidateSeconds: 300 },
    );

    expect(result).toHaveLength(3);
  });
});

function hourlyEntry(
  isoDateUTC: string,
  temp: number,
  icon: string,
  pop = 0.4,
): OwmHourlyForecastEntry {
  return {
    dt: Math.floor(new Date(isoDateUTC).getTime() / 1000),
    temp,
    pop,
    weather: [{ icon, description: "clear sky", main: "Clear", id: 800 }],
  };
}

describe("mapToHourly", () => {
  it("maps OWM hourly response to HourlyForecast format", () => {
    const entries = [hourlyEntry("2026-08-20T13:00:00Z", 63.4, "01d", 0.4)];

    const result = mapToHourly(entries);

    expect(result).toEqual([
      {
        dt: Math.floor(new Date("2026-08-20T13:00:00Z").getTime() / 1000),
        weather: {
          icon: "01d",
          description: "clear sky",
          main: "Clear",
          id: 800,
        },
        temp: 63.4,
        pop: 0.4,
      },
    ]);
  });

  it("uses only the first weather condition when the API returns more than one", () => {
    const withExtraCondition: OwmHourlyForecastEntry = {
      ...hourlyEntry("2026-08-20T13:00:00Z", 63.4, "01d"),
      weather: [
        { icon: "01d", description: "clear sky", main: "Clear", id: 800 },
        { icon: "50d", description: "mist", main: "Mist", id: 701 },
      ],
    };

    const result = mapToHourly([withExtraCondition]);

    expect(result[0].weather).toEqual({
      icon: "01d",
      description: "clear sky",
      main: "Clear",
      id: 800,
    });
  });

  it("returns an empty array for empty entries", () => {
    expect(mapToHourly([])).toEqual([]);
  });

  it("caps result to 24 hours by default", () => {
    const entries = Array.from({ length: 30 }, (_, i) =>
      hourlyEntry(
        `2026-08-20T${String(i % 24).padStart(2, "0")}:00:00Z`,
        60,
        "01d",
      ),
    );

    const result = mapToHourly(entries);

    expect(result).toHaveLength(24);
  });

  it("respects a custom limit", () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      hourlyEntry(`2026-08-20T${String(i).padStart(2, "0")}:00:00Z`, 60, "01d"),
    );

    const result = mapToHourly(entries, 5);

    expect(result).toHaveLength(5);
  });
});

describe("getHourlyForecast", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the onecall hourly timeline endpoint with lat/lon/date/cnt, returning the mapped result", async () => {
    const requestSpy = vi.spyOn(owmClient, "request").mockResolvedValue({
      lat: 40.7127,
      lon: -74.0103,
      timezone: "America/New_York",
      timezone_offset: -14400,
      data: [hourlyEntry("2026-08-20T13:00:00Z", 63.4, "01d")],
    });

    const result = await getHourlyForecast({
      coord: { lat: 40.7127, lon: -74.0103 },
      units: "metric",
      date: "2026-08-20",
    });

    expect(requestSpy).toHaveBeenCalledWith(
      "/data/4.0/onecall/timeline/1h",
      {
        lat: "40.7127",
        lon: "-74.0103",
        date: "2026-08-20",
        cnt: "24",
        units: "metric",
      },
      { revalidateSeconds: 300 },
    );
    expect(result).toHaveLength(1);
    expect(result[0].temp).toBe(63.4);
  });

  it("forwards a custom limit to both the request cnt and the mapped result length", async () => {
    const requestSpy = vi.spyOn(owmClient, "request").mockResolvedValue({
      lat: 40.7127,
      lon: -74.0103,
      timezone: "America/New_York",
      timezone_offset: -14400,
      data: Array.from({ length: 5 }, (_, i) =>
        hourlyEntry(`2026-08-20T0${i}:00:00Z`, 60, "01d"),
      ),
    });

    const result = await getHourlyForecast({
      coord: { lat: 40.7127, lon: -74.0103 },
      units: "metric",
      date: "2026-08-20",
      limit: 3,
    });

    expect(requestSpy).toHaveBeenCalledWith(
      "/data/4.0/onecall/timeline/1h",
      {
        lat: "40.7127",
        lon: "-74.0103",
        date: "2026-08-20",
        cnt: "3",
        units: "metric",
      },
      { revalidateSeconds: 300 },
    );

    expect(result).toHaveLength(3);
  });
});
