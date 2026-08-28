import { notFound } from "next/navigation";
import { CurrentWeather } from "@/components/CurrentWeather/CurrentWeather";
import { ForecastList } from "@/components/ForecastList/ForecastList";
import { HourlyForecastList } from "@/components/HourlyForecastList/HourlyForecastList";
import { CustomError } from "@/lib/errors";
import { getCurrentWeatherByLocationId } from "@/services/current-weather";
import { getDailyForecast, getHourlyForecast } from "@/services/forecast";
import type {
  Units,
  CurrentWeather as CurrentWeatherData,
  DailyForecast,
  HourlyForecast,
} from "@/types/weather";
import type { LocationCoordination } from "@/types/location";

import styles from "./WeatherDashboard.module.css";

interface WeatherDashboardProps {
  locationId: number;
  units: Units;
}

type ResponseResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; status: number };

type CityWeatherResult = ResponseResult<{ current: CurrentWeatherData }>;

async function loadCityWeather(
  locationId: number,
  units: Units,
): Promise<CityWeatherResult> {
  try {
    const current = await getCurrentWeatherByLocationId({
      id: locationId,
      units,
    });
    return { data: { current }, success: true };
  } catch (error) {
    let response: CityWeatherResult = {
      success: false,
      message: "Unknown error",
      status: 500,
    };
    if (error instanceof CustomError) {
      console.error(
        `[${error.name}] - ${error.message} - context ${JSON.stringify(error)} `,
      );
      response = {
        success: false,
        message: error.message ?? "Weather service error.",
        status: error.statusCode ?? 500,
      };
    } else {
      console.error("Unhandled route error:", error);
      response = {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
    return response as CityWeatherResult;
  }
}

type ForecastResult = ResponseResult<{ forecast: DailyForecast[] }>;

async function loadDailyForecast(
  coord: LocationCoordination,
  units: Units,
): Promise<ForecastResult> {
  try {
    const forecast = await getDailyForecast({ coord, units });
    return { data: { forecast }, success: true };
  } catch (error) {
    let response: ForecastResult = {
      success: false,
      message: "Unknown error",
      status: 500,
    };
    if (error instanceof CustomError) {
      console.error(
        `[${error.name}] - ${error.message} - context ${JSON.stringify(error)} `,
      );
      response = {
        success: false,
        message: error.message ?? "Weather service error.",
        status: error.statusCode ?? 500,
      };
    } else {
      console.error("Unhandled route error:", error);
      response = {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
    return response as ForecastResult;
  }
}

type HourlyForecastResult = ResponseResult<{ hourly: HourlyForecast[] }>;

async function loadHourlyForecast(
  coord: LocationCoordination,
  units: Units,
  date: string,
): Promise<HourlyForecastResult> {
  try {
    const hourly = await getHourlyForecast({ coord, units, date });
    return { data: { hourly }, success: true };
  } catch (error) {
    let response: HourlyForecastResult = {
      success: false,
      message: "Unknown error",
      status: 500,
    };
    if (error instanceof CustomError) {
      console.error(
        `[${error.name}] - ${error.message} - context ${JSON.stringify(error)} `,
      );
      response = {
        success: false,
        message: error.message ?? "Weather service error.",
        status: error.statusCode ?? 500,
      };
    } else {
      console.error("Unhandled route error:", error);
      response = {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
    return response as HourlyForecastResult;
  }
}

export async function WeatherDashboard({
  locationId,
  units,
}: WeatherDashboardProps) {
  const result = await loadCityWeather(locationId, units);
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

  const { current } = result.data;
  const todayDate = new Date(
    (current.dt + current.timezone) * 1000,
  ).toISOString().slice(0, 10);

  const [forecastResult, hourlyResult] = await Promise.all([
    loadDailyForecast(current.coord, units),
    loadHourlyForecast(current.coord, units, todayDate),
  ]);
  const todayPrecipitationChance = forecastResult.success
    ? (forecastResult.data.forecast[0]?.pop ?? 0)
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <CurrentWeather
            current={current}
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
      {hourlyResult.success && (
        <HourlyForecastList
          hourly={hourlyResult.data.hourly}
          timezone={current.timezone}
          title="Hourly Forecast"
        />
      )}
    </div>
  );
}
