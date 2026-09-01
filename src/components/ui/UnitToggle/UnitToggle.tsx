"use client";

import styles from "./UnitToggle.module.css";
import type { Units } from "@/types/weather";
import { APP_UNITS } from "@/constants";
import { startTransition, useOptimistic, useState } from "react";
import posthog from "posthog-js";

interface UnitToggleProps {
  units: Units;
  onChange: (next: Units) => void;
}

export function UnitToggle({ units, onChange }: UnitToggleProps) {
  const [optimisticUnits, setOptimisticUnits] = useOptimistic(units);
  const [announcement, setAnnouncement] = useState("");

  return (
    <div className={styles.group} role="group" aria-label="Temperature units">
      {Object.values(APP_UNITS).map((option) => (
        <button
          key={option.unit}
          type="button"
          aria-label={`Switch to ${option.unit} units`}
          aria-pressed={optimisticUnits === option.unit}
          data-state={optimisticUnits === option.unit ? "on" : "off"}
          className={`${styles.button} `}
          onClick={() => {
            if (option.unit === units) return;

            posthog.capture("temperature_unit_changed", {
              to_unit: option.unit,
            });
            setAnnouncement(`Units switched to ${option.unit}`);
            startTransition(() => {
              setOptimisticUnits(option.unit);
              onChange(option.unit);
            });
          }}
        >
          {option.symbol}
        </button>
      ))}
      <span role="status" className={styles.visuallyHidden}>
        {announcement}
      </span>
    </div>
  );
}
