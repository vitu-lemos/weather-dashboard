import { CloudRain } from "lucide-react";
import { WeatherIcon } from "@/components/ui/WeatherIcon/WeatherIcon";
import styles from "./HourlyForecastCard.module.css";
import type { HourlyForecast } from "@/types/weather";

interface HourlyForecastCardProps {
  hour: HourlyForecast;
  timezone: number;
}

export function HourlyForecastCard({
  hour,
  timezone,
}: HourlyForecastCardProps) {
  const time = new Date((hour.dt + timezone) * 1000).toLocaleTimeString(
    "en-US",
    { hour: "numeric", timeZone: "UTC" },
  );

  return (
    <div className={styles.card}>
      <span className={styles.time}>{time}</span>
      <div className={styles.weather}>
        <WeatherIcon className={styles.weather_icon} code={hour.weather.id} />
        <span className={styles.temp}>{Math.round(hour.temp)}°</span>
      </div>
      <span className={styles.rain}>
        <CloudRain size={14} />
        {Math.round(hour.pop * 100)}%
      </span>
    </div>
  );
}
