import { WeatherIcon } from "@/components/ui/WeatherIcon/WeatherIcon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card/Card";
import type {
  CurrentWeather as CurrentWeatherData,
  Units,
} from "@/types/weather";

import styles from "./CurrentWeather.module.css";
import { CloudRain, Droplets, Gauge, Wind } from "lucide-react";

interface CurrentWeatherProps {
  current: CurrentWeatherData;
  units?: Units;
  precipitationChance?: number;
}

const WIND_SPEED_UNIT: Record<Units, string> = {
  metric: "m/s",
  imperial: "mph",
};

export function CurrentWeather({
  current,
  units = "imperial",
  precipitationChance = 0,
}: CurrentWeatherProps) {
  const [condition] = current.weather;
  const location = `${current.name}, ${current.sys.country}`;

  const timestamp = (current.dt + current.timezone) * 1000;

  const date = new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  });

  return (
    <Card>
      <CardHeader className={styles.header}>
        <div>
          <CardTitle>{location}</CardTitle>
          <p className={styles.header__date}>{date}</p>
          <p className={styles.header__date}>{time}</p>
        </div>
        <WeatherIcon
          code={condition.id}
          className={styles.header__icon}
          variant={condition.icon.includes("n") ? "night" : "day"}
        />
      </CardHeader>
      <CardContent>
        <section
          className={styles.main}
          aria-label={`Current weather in ${location}`}
        >
          <div className={styles.main__temp}>
            <p className={styles.temp__value}>
              {Math.round(current.main.temp)}°
            </p>
            <p className={styles.temp__desc}>{condition.description}</p>
            <p className={styles.temp__feels_like}>
              Feels like {Math.round(current.main.feels_like)}°
              {units === "metric" ? "C" : "F"}
            </p>
          </div>
          <dl className={styles.metrics}>
            <div className={styles.metric}>
              <CloudRain size={16} />
              <dt>Rain Chance: </dt>
              <dd>{Math.round(precipitationChance * 100)}%</dd>
            </div>
            <div className={styles.metric}>
              <Droplets />
              <dt>Humidity: </dt>
              <dd>{current.main.humidity}%</dd>
            </div>
            <div className={styles.metric}>
              <Wind />
              <dt>Wind Speed: </dt>
              <dd>
                {Math.round(current.wind.speed)} {WIND_SPEED_UNIT[units]}
              </dd>
            </div>
            <div className={styles.metric}>
              <Gauge />
              <dt>Pressure: </dt>
              <dd>{current.main.pressure} hPa</dd>
            </div>
          </dl>
        </section>
      </CardContent>
    </Card>
  );
}
