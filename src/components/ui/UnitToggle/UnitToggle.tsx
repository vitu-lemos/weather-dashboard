"use client";

import styles from "./UnitToggle.module.css";
import type { Units } from "@/types/weather";
import { APP_UNITS } from "@/constants";
import { startTransition, useOptimistic } from "react";

interface UnitToggleProps {
  units: Units;
  onChange: (next: Units) => void;
}

export function UnitToggle({ units, onChange }: UnitToggleProps) {
  const [optimisticUnits, setOptimisticUnits] = useOptimistic(units);

  return (
    <div className={styles.group} role="group" aria-label="Temperature units">
      {Object.values(APP_UNITS).map((option) => (
        <button
          key={option.unit}
          type="button"
          aria-label={`Switch to ${option.unit} units`}
          data-state={optimisticUnits === option.unit ? "on" : "off"}
          className={`${styles.button} `}
          onClick={() => {
            startTransition(() => {
              setOptimisticUnits(option.unit);
              onChange(option.unit);
            });
          }}
        >
          {option.symbol}
        </button>
      ))}
    </div>
  );
}
