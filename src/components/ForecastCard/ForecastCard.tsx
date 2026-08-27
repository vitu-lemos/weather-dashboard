import { WeatherIcon } from "@/components/ui/WeatherIcon/WeatherIcon";
import styles from "./ForecastCard.module.css";
import type { DailyForecast } from "@/types/weather";

interface ForecastCardProps {
  day: DailyForecast;
}

export function ForecastCard({ day }: ForecastCardProps) {
  return (
    <li className={styles.card}>
      <span className={styles.day}>{day.label}</span>
      <WeatherIcon code={day.weather.id} size={34} style={{ opacity: 0.95 }} />
      <span className={styles.temps}>
        <span className={styles.low}>L {day.temp.min}°</span>
        <span className={styles.high}>H {day.temp.max}°</span>
      </span>
    </li>
  );
}
