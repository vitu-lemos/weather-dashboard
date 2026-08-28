import { notFound } from "next/navigation";
import { CurrentWeather } from "@/components/CurrentWeather/CurrentWeather";
import { ForecastList } from "@/components/ForecastList/ForecastList";
import { HourlyForecastList } from "@/components/HourlyForecastList/HourlyForecastList";
import { ErrorBanner } from "@/components/ui/ErrorBanner/ErrorBanner";
import { safeLoad } from "@/lib/errors/server-request-with-error-handler";
import { getCurrentWeatherByCoord } from "@/services/current-weather";
import { getDailyForecast, getHourlyForecast } from "@/services/forecast";
import type { Units } from "@/types/weather";
import type { LocationCoordination } from "@/types/location";

import styles from "./WeatherDashboard.module.css";

interface WeatherDashboardProps {
  coord: LocationCoordination;
  units: Units;
}

export async function WeatherDashboard({
  coord,
  units,
}: WeatherDashboardProps) {
  const cityResult = await safeLoad(() =>
    getCurrentWeatherByCoord({ ...coord, units }),
  );

  if (!cityResult.success && cityResult.status === 404) {
    notFound();
  }

  if (!cityResult.success) {
    return (
      <div className={styles.page}>
        <ErrorBanner
          title="Failed to load city weather"
          message={cityResult.message}
        />
      </div>
    );
  }

  const current = cityResult.data;
  const todayDate = new Date((current.dt + current.timezone) * 1000)
    .toISOString()
    .slice(0, 10);

  const [forecastResult, hourlyResult] = await Promise.all([
    safeLoad(() => getDailyForecast({ coord: current.coord, units })),
    safeLoad(() =>
      getHourlyForecast({ coord: current.coord, units, date: todayDate }),
    ),
  ]);
  const todayPrecipitationChance = forecastResult.success
    ? (forecastResult.data[0]?.pop ?? 0)
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
        <div className={styles.sidebar}>
          {forecastResult.success ? (
            <ForecastList
              forecast={forecastResult.data}
              title="5-Day Forecast"
            />
          ) : (
            <ErrorBanner
              title="Failed to load forecast"
              message={forecastResult.message}
            />
          )}
        </div>
      </div>
      {hourlyResult.success ? (
        <HourlyForecastList
          hourly={hourlyResult.data}
          timezone={current.timezone}
          title="Hourly Forecast"
        />
      ) : (
        <ErrorBanner
          title="Failed to load hourly forecast"
          message={hourlyResult.message}
        />
      )}
    </div>
  );
}
