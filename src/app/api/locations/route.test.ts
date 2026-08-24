import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/services/location-finder", () => ({
  findLocations: vi.fn(),
}));

import { findLocations } from "@/services/location-finder";

import { GET } from "./route";

function makeRequest(url: string) {
  return new NextRequest(new Request(url));
}

const resolvedLocation = (id: number, name: string, country: string) => ({
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

describe("GET /api/locations", () => {
  it("returns 400 when search is missing", async () => {
    const res = await GET(makeRequest("http://localhost/api/locations"));

    expect(res.status).toBe(400);
  });

  it("returns the mapped locations for a valid search", async () => {
    const location = resolvedLocation(3459943, "New York", "US");
    vi.mocked(findLocations).mockResolvedValue([location]);

    const res = await GET(
      makeRequest(
        "http://localhost/api/locations?search=" +
          encodeURIComponent("New York"),
      ),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      locations: [location],
    });
  });

  it("sanitizes the city param before calling findLocations", async () => {
    const location = resolvedLocation(3459943, "New York", "US");

    vi.mocked(findLocations).mockResolvedValue([location]);

    await GET(
      makeRequest(
        "http://localhost/api/locations?search=" +
          encodeURIComponent("<b>NYC</b>"),
      ),
    );

    expect(findLocations).toHaveBeenCalledWith({
      city: "NYC",
      units: "metric",
    });
  });

  it("passes a valid units param through", async () => {
    const location = resolvedLocation(3459943, "New York", "US");

    vi.mocked(findLocations).mockResolvedValue([location]);

    await GET(
      makeRequest(
        "http://localhost/api/locations?search=Chicago&units=imperial",
      ),
    );

    expect(findLocations).toHaveBeenCalledWith({
      city: "Chicago",
      units: "imperial",
    });
  });

  it("returns 200 with an empty locations array when findLocations returns an empty array", async () => {
    vi.mocked(findLocations).mockResolvedValue([]);

    const res = await GET(
      makeRequest("http://localhost/api/locations?search=Zzzzz"),
    );

    console.log(res);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ locations: [] });
  });
});
