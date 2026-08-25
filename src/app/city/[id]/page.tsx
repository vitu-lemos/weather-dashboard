import { notFound } from "next/navigation";
import { CurrentWeather } from "@/components/CurrentWeather/CurrentWeather";

import { CustomError } from "@/lib/errors";

import type {
  Units,
  CurrentWeather as CurrentWeatherData,
} from "@/types/weather";
import { getCurrentWeatherByLocationId } from "@/services/current-weather";

type CityWeatherResult =
  | { success: true; data: { current: CurrentWeatherData } }
  | { success: false; message: string; status: number };

async function loadCityWeather(
  cityId: number,
  units: Units,
): Promise<CityWeatherResult> {
  try {
    const [current] = await Promise.all([
      getCurrentWeatherByLocationId({ id: cityId, units }),
    ]);
    return { data: { current }, success: true };
  } catch (error) {
    const message =
      error instanceof CustomError ? error.message : "Weather service error.";
    const status = error instanceof CustomError ? error.statusCode : 500;
    return { success: false, message, status };
  }
}

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

  const result = await loadCityWeather(cityId, units);
  if (result.success === false && result.status === 404) {
    notFound();
  }

  if (!result.success) {
    return (
      <div>
        <h1>Failed to load city weather</h1>
      </div>
    );
  }

  return (
    <>
      <CurrentWeather current={result.data.current} />
    </>
  );
}
