import Link from "next/link";
import { UnitToggle } from "../UnitToggle/UnitToggle";
import styles from "./AppHeader.module.css";

export function AppHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.title}>
        Weather
      </Link>
      <UnitToggle />
    </header>
  );
}
