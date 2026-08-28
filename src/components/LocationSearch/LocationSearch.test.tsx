import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocationSearch } from "./LocationSearch";
import type { Location } from "@/types/location";

function mockLocation(overrides: Partial<Location> = {}): Location {
  return {
    name: "New York",
    lat: 40.7128,
    lon: -74.006,
    country: "US",
    main: { temp: 22 },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    ],
    ...overrides,
  };
}

function mockLocationsFetch(locations: Location[]) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ locations }),
  });
}

function getSearchInput() {
  return screen.getByRole("combobox", { name: "Search city" });
}

describe("LocationSearch", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a search input with the city placeholder", () => {
    render(<LocationSearch onSelect={vi.fn()} unit="metric" />);
    expect(getSearchInput()).toBeDefined();
  });

  it("fetches the locations route with the search term and given unit", async () => {
    const fetchMock = mockLocationsFetch([mockLocation()]);
    vi.stubGlobal("fetch", fetchMock);

    render(<LocationSearch onSelect={vi.fn()} unit="metric" />);
    fireEvent.change(getSearchInput(), { target: { value: "New York" } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1), {
      timeout: 1000,
    });
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/api/locations?search=New%20York");
    expect(calledUrl).toContain("units=metric");
  });

  it("renders each result with the location name, and temperature", async () => {
    vi.stubGlobal("fetch", mockLocationsFetch([mockLocation()]));

    render(<LocationSearch onSelect={vi.fn()} unit="metric" />);
    fireEvent.change(getSearchInput(), { target: { value: "New York" } });

    await waitFor(
      () => expect(screen.getByText("New York, US")).toBeDefined(),
      { timeout: 1000 },
    );
    expect(screen.getByText("22°")).toBeDefined();
  });

  it("calls onSelect with the picked location when an option is clicked", async () => {
    const location = mockLocation();
    const onSelect = vi.fn();
    vi.stubGlobal("fetch", mockLocationsFetch([location]));

    render(<LocationSearch onSelect={onSelect} unit="metric" />);
    fireEvent.change(getSearchInput(), { target: { value: "New York" } });

    const option = await waitFor(() => screen.getByText("New York, US"), {
      timeout: 1000,
    });
    fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith(location);
  });
});
