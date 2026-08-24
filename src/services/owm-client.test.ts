// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { OpenWeatherMapApiClient } from "./owm-client";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe("OpenWeatherMapApiClient.request", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("builds the URL with defaults, params, and the API key", async () => {
    const client = new OpenWeatherMapApiClient({
      baseUrl: "https://api.openweathermap.org",
      apiKey: "test-key",
    });
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(jsonResponse({ ok: true }));

    await client.request("/data/2.5/weather", { id: "123" });

    const calledUrl = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(calledUrl.pathname).toBe("/data/2.5/weather");
    expect(calledUrl.searchParams.get("id")).toBe("123");
    expect(calledUrl.searchParams.get("units")).toBe("metric");
    expect(calledUrl.searchParams.get("lang")).toBe("en");
    expect(calledUrl.searchParams.get("appid")).toBe("test-key");
  });

  it("lets a caller param override a default", async () => {
    const client = new OpenWeatherMapApiClient({
      baseUrl: "https://api.openweathermap.org",
      apiKey: "test-key",
    });
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(jsonResponse({ ok: true }));

    await client.request("/data/2.5/weather", { id: "123", units: "imperial" });

    const calledUrl = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(calledUrl.searchParams.get("units")).toBe("imperial");
  });

  it("returns the parsed JSON body on success", async () => {
    const client = new OpenWeatherMapApiClient({
      baseUrl: "https://api.openweathermap.org",
      apiKey: "test-key",
    });
    vi.spyOn(global, "fetch").mockResolvedValue(
      jsonResponse({ hello: "world" }),
    );

    const result = await client.request("/data/2.5/weather", { id: "123" });

    expect(result).toEqual({ hello: "world" });
  });

  it("throws BadGatewayError when the upstream response is not ok", async () => {
    const client = new OpenWeatherMapApiClient({
      baseUrl: "https://api.openweathermap.org",
      apiKey: "test-key",
    });
    vi.spyOn(global, "fetch").mockResolvedValue(
      jsonResponse({ message: "city not found" }, 404),
    );

    await expect(
      client.request("/data/2.5/weather", { id: "999" }),
    ).rejects.toMatchObject({ name: "BadGatewayError", statusCode: 502 });
  });

  it("throws ServiceUnavailableError when no API key is set", async () => {
    const client = new OpenWeatherMapApiClient({
      baseUrl: "https://api.openweathermap.org",
      apiKey: undefined,
    });

    await expect(
      client.request("/data/2.5/weather", { id: "123" }),
    ).rejects.toMatchObject({ name: "ServiceUnavailableError" });
  });

  it("adds a next.revalidate field when revalidateSeconds is set", async () => {
    const client = new OpenWeatherMapApiClient({
      baseUrl: "https://api.openweathermap.org",
      apiKey: "test-key",
    });
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(jsonResponse({ ok: true }));

    await client.request(
      "/data/2.5/weather",
      { id: "123" },
      { revalidateSeconds: 300 },
    );

    const init = fetchSpy.mock.calls[0][1] as { next?: { revalidate: number } };
    expect(init.next).toEqual({ revalidate: 300 });
  });
});
