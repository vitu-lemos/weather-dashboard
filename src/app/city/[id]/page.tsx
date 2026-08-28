import { notFound } from "next/navigation";
import { WeatherDashboard } from "@/components/WeatherDashboard/WeatherDashboard";
import type { Units } from "@/types/weather";

export default async function CityPage({
  params,
  searchParams,
}: PageProps<"/city/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const units: Units = query.units === "metric" ? "metric" : "imperial";
  const cityId = Number(id);

  if (!Number.isInteger(cityId) || cityId <= 0) {
    notFound();
  }

  return <WeatherDashboard locationId={cityId} units={units} />;
}
