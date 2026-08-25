import { WeatherIcon } from "@/components/WeatherIcon/WeatherIcon";
import type { CurrentWeather as CurrentWeatherData } from "@/types/weather";

import styles from "./CurrentWeather.module.css";

interface CurrentWeatherProps {
  current: CurrentWeatherData;
}

export function CurrentWeather({ current }: CurrentWeatherProps) {
  const [condition] = current.weather;
  const location = `${current.name}, ${current.sys.country}`;
  return (
    <section
      className={styles.hero}
      aria-label={`Current weather in ${location}`}
    >
      <WeatherIcon
        code={condition.id}
        className={styles.icon}
        variant={condition.icon.includes("n") ? "night" : "day"}
      />
      <h2 className={styles.city}>{location}</h2>
      <p className={styles.temp}>{Math.round(current.main.temp)}°</p>
      <p className={styles.desc}>{condition.description}</p>
    </section>
  );
}
