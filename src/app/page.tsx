import type { Metadata } from "next";
import { geolocation } from "@vercel/functions";
import { headers } from "next/headers";

import { WeatherDashboard } from "@/components/WeatherDashboard/WeatherDashboard";
import { DEFAULT_APP_UNIT, DEFAULT_LOCATION_COORD } from "@/constants";
import { safeLoad } from "@/lib/errors/server-request-with-error-handler";
import { getCurrentWeatherByCoord } from "@/services/current-weather";
import type { Units } from "@/types/weather";

function parseCoord(
  value: string | string[] | undefined | null,
): number | null {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) ? parsed : null;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function resolveParams(searchParams: PageProps<"/">["searchParams"]) {
  const query = await searchParams;
  const units: Units =
    query.units === "metric" || query.units === "imperial"
      ? query.units
      : DEFAULT_APP_UNIT.unit;

  const geo = geolocation({ headers: await headers() });

  const lat =
    parseCoord(query.lat) ??
    parseCoord(geo.latitude) ??
    DEFAULT_LOCATION_COORD.lat;
  const lon =
    parseCoord(query.lon) ??
    parseCoord(geo.longitude) ??
    DEFAULT_LOCATION_COORD.lon;

  return { lat, lon, units };
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/">): Promise<Metadata> {
  const { lat, lon, units } = await resolveParams(searchParams);
  const result = await safeLoad(() =>
    getCurrentWeatherByCoord({ lat, lon, units }),
  );

  if (!result.success) {
    return {
      title: "Weather Service",
      description: "Current weather, 5-day and hourly forecast.",
    };
  }

  const { name, sys, weather, main } = result.data;
  const location = `${name}, ${sys.country}`;
  const condition = capitalize(weather[0]?.description ?? "");
  const temp = Math.round(main.temp);
  const unitSymbol = units === "metric" ? "°C" : "°F";

  return {
    title: `${location} Weather – ${temp}${unitSymbol}, ${condition}`,
    description: `Current weather in ${location}: ${temp}${unitSymbol}, ${condition}. See 5-day and hourly forecast.`,
  };
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const { lat, lon, units } = await resolveParams(searchParams);

  return <WeatherDashboard coord={{ lat, lon }} units={units} />;
}
