import { CurrentWeatherSkeleton } from "@/components/CurrentWeather/CurrentWeatherSkeleton";
import { ForecastListSkeleton } from "@/components/ForecastList/ForecastListSkeleton";
import { HourlyForecastListSkeleton } from "@/components/HourlyForecastList/HourlyForecastListSkeleton";

import styles from "./WeatherDashboard.module.css";

export function WeatherDashboardSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <CurrentWeatherSkeleton />
        </div>
        <div className={styles.sidebar}>
          <ForecastListSkeleton />
        </div>
      </div>
      <HourlyForecastListSkeleton />
    </div>
  );
}
