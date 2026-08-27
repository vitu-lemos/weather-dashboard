import { ForecastCard } from "@/components/ForecastCard/ForecastCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card/Card";
import styles from "./ForecastList.module.css";
import type { DailyForecast } from "@/types/weather";

interface ForecastListProps {
  forecast: DailyForecast[];
  title: string;
}

export function ForecastList({ forecast, title }: ForecastListProps) {
  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul aria-label={title} className={styles.list}>
          {forecast.map((day) => (
            <li
              key={day.label}
              aria-label={`Forecast for ${day.label}`}
              className={styles.list__item}
            >
              <ForecastCard day={day} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
