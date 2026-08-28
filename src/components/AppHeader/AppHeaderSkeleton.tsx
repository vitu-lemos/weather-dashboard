import styles from "./AppHeaderSkeleton.module.css";

export function AppHeaderSkeleton() {
  return (
    <div className={styles.header} role="status" aria-label="Loading header">
      <div className={styles.top}>
        <span className={`${styles.block} ${styles.title}`} />
        <span className={styles.units}>
          <span className={`${styles.block} ${styles.pill}`} />
          <span className={`${styles.block} ${styles.pill}`} />
        </span>
      </div>
      <span className={`${styles.block} ${styles.search}`} />
    </div>
  );
}
