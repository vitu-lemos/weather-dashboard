import type { Metadata } from "next";
import { WeatherDashboard } from "@/components/WeatherDashboard/WeatherDashboard";
import { DEFAULT_APP_UNIT } from "@/constants";
import { safeLoad } from "@/lib/errors/server-request-with-error-handler";
import { getCurrentWeatherByCoord } from "@/services/current-weather";
import type { Units } from "@/types/weather";

const DEFAULT_COORD = { lat: 40.7127281, lon: -74.0060152 }; // New York

function parseCoord(value: string | string[] | undefined): number | null {
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

  const lat = parseCoord(query.lat) ?? DEFAULT_COORD.lat;
  const lon = parseCoord(query.lon) ?? DEFAULT_COORD.lon;

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
