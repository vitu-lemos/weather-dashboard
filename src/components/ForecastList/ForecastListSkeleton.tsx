import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

import styles from "./ForecastListSkeleton.module.css";

const ROWS = 5;

export function ForecastListSkeleton() {
  return (
    <Card className={styles.card} role="status" aria-label="Loading forecast">
      <CardHeader>
        <Skeleton className={styles.title} />
      </CardHeader>
      <CardContent>
        <ul className={styles.list}>
          {Array.from({ length: ROWS }).map((_, index) => (
            <li key={index} className={styles.row}>
              <Skeleton className={styles.day} />
              <Skeleton className={styles.icon} />
              <Skeleton className={styles.rain} />
              <Skeleton className={styles.temps} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
