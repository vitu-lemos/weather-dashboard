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

const resolvedLocation = (name: string, country: string) => ({
  name,
  lat: 0,
  lon: 0,
  country,
  main: { temp: 22.89 },
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
    const location = resolvedLocation("New York", "US");
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
    const location = resolvedLocation("New York", "US");

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
    const location = resolvedLocation("New York", "US");

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
