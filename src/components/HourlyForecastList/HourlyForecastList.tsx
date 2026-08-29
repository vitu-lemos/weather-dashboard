import { HourlyForecastCard } from "@/components/HourlyForecastCard/HourlyForecastCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card/Card";
import styles from "./HourlyForecastList.module.css";
import type { HourlyForecast } from "@/types/weather";

interface HourlyForecastListProps {
  hourly: HourlyForecast[];
  timezone: number;
  title: string;
}

export function HourlyForecastList({
  hourly,
  timezone,
  title,
}: HourlyForecastListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul aria-label={title} className={styles.list} tabIndex={0}>
          {hourly.map((hour) => (
            <li key={hour.dt} className={styles.list__item}>
              <HourlyForecastCard hour={hour} timezone={timezone} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
