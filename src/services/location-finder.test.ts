import { describe, expect, it, vi } from "vitest";
import { NotFoundError } from "@/lib/errors";
import { owmClient } from "./owm-client";
import { findLocations } from "./location-finder";

const rawLocation = (id: number, name: string, country: string) => ({
  id,
  name,
  coord: { lat: 0, lon: 0 },
  sys: { country },
  main: {
    temp: 22.89,
    feels_like: 22.64,
    temp_min: 22.79,
    temp_max: 23.52,
    pressure: 1021,
    humidity: 54,
    sea_level: 1021,
    grnd_level: 947,
  },
  dt: 1787577770,
  wind: {
    speed: 4.3,
    deg: 113,
  },
  clouds: {
    all: 10,
  },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01d",
    },
  ],
});

describe("findLocations", () => {
  it("maps the OWM find response to Location objects", async () => {
    const locations = rawLocation(3459943, "Jequié", "BR");
    vi.spyOn(owmClient, "request").mockResolvedValue({
      message: "like",
      cod: "200",
      count: 2,
      list: [locations],
    });

    const result = await findLocations({ city: "Jequié" });

    expect(result).toEqual([locations]);
  });

  it("calls the find endpoint search query and default params", async () => {
    const requestSpy = vi
      .spyOn(owmClient, "request")
      .mockResolvedValue({ list: [rawLocation(1, "X", "US")] });

    await findLocations({ city: "Chicago" });

    expect(requestSpy).toHaveBeenCalledWith("/data/2.5/find", {
      q: "Chicago",
      type: "like",
      sort: "population",
      cnt: "5",
      units: "metric",
    });
  });

  it("lets a caller param override a default", async () => {
    const requestSpy = vi
      .spyOn(owmClient, "request")
      .mockResolvedValue({ list: [rawLocation(1, "X", "US")] });

    await findLocations({ city: "Chicago", limit: 3, units: "imperial" });

    expect(requestSpy).toHaveBeenCalledWith(
      "/data/2.5/find",
      expect.objectContaining({
        q: "Chicago",
        type: "like",
        sort: "population",
        cnt: "3",
        units: "imperial",
      }),
    );
  });

  it("throws NotFoundError when the list is empty", async () => {
    vi.spyOn(owmClient, "request").mockResolvedValue({ list: [] });

    await expect(findLocations({ city: "Nowhere" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
