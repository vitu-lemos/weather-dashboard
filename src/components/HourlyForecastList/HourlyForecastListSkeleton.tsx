import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

import styles from "./HourlyForecastListSkeleton.module.css";

const ITEMS = 8;

export function HourlyForecastListSkeleton() {
  return (
    <Card role="status" aria-label="Loading hourly forecast">
      <CardHeader>
        <Skeleton className={styles.title} />
      </CardHeader>
      <CardContent>
        <ul className={styles.list}>
          {Array.from({ length: ITEMS }).map((_, index) => (
            <li key={index} className={styles.card}>
              <Skeleton className={styles.time} />
              <Skeleton className={styles.icon} />
              <Skeleton className={styles.temp} />
              <Skeleton className={styles.rain} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
