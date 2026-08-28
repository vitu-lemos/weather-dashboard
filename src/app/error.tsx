"use client";

import { useEffect } from "react";
import { ErrorBanner } from "@/components/ui/ErrorBanner/ErrorBanner";

import styles from "./error.module.css";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.page}>
      <ErrorBanner
        title="Something went wrong"
        message={error.message || "An unexpected error occurred."}
      />
      <button type="button" className={styles.retry} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
