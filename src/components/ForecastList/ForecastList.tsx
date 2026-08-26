import { ForecastCard } from "@/components/ForecastCard/ForecastCard";
import styles from "./ForecastList.module.css";
import type { DailyForecast } from "@/types/weather";

interface ForecastListProps {
  forecast: DailyForecast[];
  title: string;
}

export function ForecastList({ forecast, title }: ForecastListProps) {
  return (
    <section aria-label={title}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {forecast.map((day) => (
          <ForecastCard key={day.label} day={day} />
        ))}
      </ul>
    </section>
  );
}
