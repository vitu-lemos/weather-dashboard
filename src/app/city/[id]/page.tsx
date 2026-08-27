import { notFound } from "next/navigation";
import { CurrentWeather } from "@/components/CurrentWeather/CurrentWeather";

import { CustomError } from "@/lib/errors";

import type {
  Units,
  CurrentWeather as CurrentWeatherData,
  DailyForecast,
} from "@/types/weather";
import { getCurrentWeatherByLocationId } from "@/services/current-weather";
import { getDailyForecast } from "@/services/forecast";
import { LocationCoordination } from "@/types/location";
import { ForecastList } from "@/components/ForecastList/ForecastList";
import styles from "./page.module.css";

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

type ForecastResult =
  | { success: true; data: { forecast: DailyForecast[] } }
  | { success: false; message: string; status: number };

async function loadDailyForecast(
  coord: LocationCoordination,
  units: Units,
): Promise<ForecastResult> {
  try {
    const forecast = await getDailyForecast({
      coord,
      units,
    });
    return { data: { forecast }, success: true };
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
        <p>{result.message}</p>
      </div>
    );
  }

  const forecastResult = await loadDailyForecast(
    result.data.current.coord,
    units,
  );
  const todayPrecipitationChance = forecastResult.success
    ? (forecastResult.data.forecast[0]?.pop ?? 0)
    : 0;
  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <CurrentWeather
          current={result.data.current}
          units={units}
          precipitationChance={todayPrecipitationChance}
        />
      </div>
      {forecastResult.success && (
        <div className={styles.sidebar}>
          <ForecastList
            forecast={forecastResult.data.forecast}
            title="5-Day Forecast"
          />
        </div>
      )}
    </div>
  );
}
