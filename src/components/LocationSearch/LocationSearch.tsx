"use client";

import { useCallback, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { WeatherIcon } from "@/components/ui/WeatherIcon/WeatherIcon";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import type { Location } from "@/types/location";
import type { Units } from "@/types/weather";
import styles from "./LocationSearch.module.css";

interface LocationSearchProps {
  onSelect: (location: Location) => void;
  unit: Units;
  placeholder?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
}

function getOptionLabel(location: Location): string {
  return `${location.name}, ${location.country}`;
}

export function LocationSearch({
  onSelect,
  unit,
  placeholder = "Search city",
  ariaLabel = "Search city",
}: LocationSearchProps) {
  const [value, setValue] = useState<Location | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleSearch = useCallback(
    async (term: string): Promise<Location[]> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/locations?search=${encodeURIComponent(term)}&units=${unit}`,
          { signal: controller.signal },
        );
        if (!res.ok) return [];
        const data: { locations: Location[] } = await res.json();
        return data.locations ?? [];
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return [];
        }
        throw error;
      }
    },
    [unit],
  );

  const handleSelect = useCallback(
    (location: Location) => {
      setValue(null);
      onSelect(location);
    },
    [onSelect],
  );

  const renderOption = useCallback((location: Location) => {
    const [condition] = location.weather;
    return (
      <div className={styles.option}>
        <ReactCountryFlag
          countryCode={location.country}
          svg
          className={styles.optionFlag}
          role="presentation"
          aria-label=""
        />
        <span className={styles.optionName}>{getOptionLabel(location)}</span>
        {condition && (
          <WeatherIcon
            code={condition.id}
            variant={condition.icon.includes("n") ? "night" : "day"}
            className={styles.optionIcon}
          />
        )}
        <span className={styles.optionTemp}>
          {Math.round(location.main.temp)}°
        </span>
      </div>
    );
  }, []);

  return (
    <SearchBar<Location>
      value={value}
      onChange={setValue}
      autoFocus
      onSearch={handleSearch}
      onSelect={handleSelect}
      renderOptionLabel={renderOption}
      getOptionValue={(location) => `${location.lat},${location.lon}`}
      getOptionLabel={getOptionLabel}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}
