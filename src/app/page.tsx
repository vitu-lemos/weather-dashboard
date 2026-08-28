import { WeatherDashboard } from "@/components/WeatherDashboard/WeatherDashboard";
import { DEFAULT_APP_UNIT } from "@/constants";
import type { Units } from "@/types/weather";

const DEFAULT_COORD = { lat: 40.7127281, lon: -74.0060152 }; // New York

function parseCoord(value: string | string[] | undefined): number | null {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const query = await searchParams;
  const units: Units =
    query.units === "metric" || query.units === "imperial"
      ? query.units
      : DEFAULT_APP_UNIT.unit;

  const lat = parseCoord(query.lat) ?? DEFAULT_COORD.lat;
  const lon = parseCoord(query.lon) ?? DEFAULT_COORD.lon;

  return <WeatherDashboard coord={{ lat, lon }} units={units} />;
}
