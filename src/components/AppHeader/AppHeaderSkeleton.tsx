import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import styles from "./AppHeaderSkeleton.module.css";

export function AppHeaderSkeleton() {
  return (
    <div className={styles.header} role="status" aria-label="Loading header">
      <div className={styles.top}>
        <Skeleton className={styles.title} />
        <span className={styles.units}>
          <Skeleton className={styles.pill} />
          <Skeleton className={styles.pill} />
        </span>
      </div>
      <Skeleton className={styles.search} />
    </div>
  );
}
