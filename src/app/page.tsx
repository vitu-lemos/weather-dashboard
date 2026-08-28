import { WeatherDashboard } from "@/components/WeatherDashboard/WeatherDashboard";
import { DEFAULT_APP_UNIT } from "@/constants";
import type { Units } from "@/types/weather";

const DEFAULT_CITY_ID = 5128581; // New York

export default async function Home({ searchParams }: PageProps<"/">) {
  const query = await searchParams;
  const units: Units =
    query.units === "metric" || query.units === "imperial"
      ? query.units
      : DEFAULT_APP_UNIT.unit;

  return <WeatherDashboard locationId={DEFAULT_CITY_ID} units={units} />;
}
