import { CloudRain } from "lucide-react";
import { WeatherIcon } from "@/components/ui/WeatherIcon/WeatherIcon";
import styles from "./ForecastCard.module.css";
import type { DailyForecast } from "@/types/weather";
import { Card } from "../ui/Card/Card";

interface ForecastCardProps {
  day: DailyForecast;
}

export function ForecastCard({ day }: ForecastCardProps) {
  return (
    <Card className={styles.card}>
      <span className={styles.day}>{day.label}</span>
      <WeatherIcon code={day.weather.id} size={28} style={{ opacity: 0.95 }} />
      <span className={styles.rain}>
        <CloudRain size={16} />
        {Math.round(day.pop * 100)}%
      </span>
      <span className={styles.temps}>
        <span className={styles.low}>L {day.temp.min}°</span>
        <span className={styles.high}>H {day.temp.max}°</span>
      </span>
    </Card>
  );
}
