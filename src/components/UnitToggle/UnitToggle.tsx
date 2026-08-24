"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./UnitToggle.module.css";
import type { Units } from "@/types/weather";
import { APP_UNITS } from "@/constants";

export function UnitToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawUnits = searchParams.get("units");
  const units: Units = rawUnits === "metric" ? "metric" : "imperial";

  const handleChange = (next: Units) => {
    const params = new URLSearchParams(searchParams);
    params.set("units", next);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.group} role="group" aria-label="Temperature units">
      {Object.values(APP_UNITS).map((option) => (
        <button
          key={option.unit}
          type="button"
          data-state={units === option.unit ? "on" : "off"}
          className={`${styles.button} `}
          onClick={() => handleChange(option.unit)}
        >
          {option.symbol}
        </button>
      ))}
    </div>
  );
}
