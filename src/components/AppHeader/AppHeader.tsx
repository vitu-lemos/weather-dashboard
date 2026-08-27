"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Location } from "@/types/location";
import type { Units } from "@/types/weather";

import { LocationSearch } from "@/components/LocationSearch/LocationSearch";
import { UnitToggle } from "@/components/ui/UnitToggle/UnitToggle";

import styles from "./AppHeader.module.css";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const units: Units =
    searchParams.get("units") === "metric" ? "metric" : "imperial";

  const onChangeLocation = useCallback(
    (location: Location) => {
      router.push(`/city/${location.id}?units=${units}`);
    },
    [router, units],
  );

  const onChangeUnits = (next: Units) => {
    const params = new URLSearchParams(searchParams);
    params.set("units", next);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <Link href="/" className={styles.title}>
          Weather
        </Link>
        <UnitToggle units={units} onChange={onChangeUnits} />
      </div>
      <div className={styles.search}>
        <LocationSearch onSelect={onChangeLocation} unit={units} />
      </div>
    </header>
  );
}
