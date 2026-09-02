"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

import { ErrorBanner } from "@/components/ui/ErrorBanner/ErrorBanner";

import styles from "./error.module.css";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    posthog.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className={styles.page}>
          <ErrorBanner
            title="Something went wrong"
            message={error.message || "An unexpected error occurred."}
          />
          <button type="button" className={styles.retry} onClick={reset}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
