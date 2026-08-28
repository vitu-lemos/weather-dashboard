import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppHeader } from "./AppHeader";
import type { Location } from "@/types/location";

const pushMock = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/",
  useSearchParams: () => searchParams,
}));

function mockLocation(overrides: Partial<Location> = {}): Location {
  return {
    name: "New York",
    lat: 40.7128,
    lon: -74.006,
    country: "US",
    main: { temp: 22 },
    weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
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

describe("AppHeader", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    pushMock.mockClear();
    searchParams = new URLSearchParams();
  });

  it("renders the city search bar", () => {
    render(<AppHeader />);
    expect(getSearchInput()).toBeDefined();
  });

  it("passes the current units to the location search", async () => {
    searchParams = new URLSearchParams("units=metric");
    const fetchMock = mockLocationsFetch([mockLocation()]);
    vi.stubGlobal("fetch", fetchMock);

    render(<AppHeader />);
    fireEvent.change(getSearchInput(), { target: { value: "New York" } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1), {
      timeout: 1000,
    });
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("units=metric");
  });

  it("navigates home with the coords and current units when a result is picked", async () => {
    searchParams = new URLSearchParams("units=metric");
    vi.stubGlobal("fetch", mockLocationsFetch([mockLocation()]));

    render(<AppHeader />);
    fireEvent.change(getSearchInput(), { target: { value: "New York" } });

    const option = await waitFor(() => screen.getByText("New York, US"), {
      timeout: 1000,
    });
    fireEvent.click(option);

    expect(pushMock).toHaveBeenCalledWith(
      "/?lat=40.7128&lon=-74.006&units=metric",
    );
  });
});
