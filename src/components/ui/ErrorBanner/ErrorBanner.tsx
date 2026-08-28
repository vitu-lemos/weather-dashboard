import { TriangleAlert } from "lucide-react";
import { joinClassNames } from "@/helpers/classnames";

import styles from "./ErrorBanner.module.css";

interface ErrorBannerProps {
  title: string;
  message: string;
  className?: string;
}

export function ErrorBanner({ title, message, className }: ErrorBannerProps) {
  return (
    <div
      className={joinClassNames(styles.banner, className)}
      role="alert"
      aria-label={title}
    >
      <TriangleAlert className={styles.icon} />
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
