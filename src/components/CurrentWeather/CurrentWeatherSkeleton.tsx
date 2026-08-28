import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

import styles from "./CurrentWeatherSkeleton.module.css";

export function CurrentWeatherSkeleton() {
  return (
    <Card
      className={styles.card}
      role="status"
      aria-label="Loading current weather"
    >
      <CardHeader className={styles.header}>
        <div>
          <Skeleton className={styles.title} />
          <Skeleton className={styles.line} />
          <Skeleton className={styles.line} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.main}>
          <div className={styles.main__content}>
            <div className={styles.temp}>
              <Skeleton className={styles.temp__value} />
              <Skeleton className={styles.temp__desc} />
              <Skeleton className={styles.temp__feels} />
            </div>
            <Skeleton className={styles.icon} />
          </div>
          <div className={styles.metrics}>
            <Skeleton className={styles.metric} />
            <Skeleton className={styles.metric} />
            <Skeleton className={styles.metric} />
            <Skeleton className={styles.metric} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
