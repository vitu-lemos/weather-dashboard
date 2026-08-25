import styles from "./WeatherIcon.module.css";

/* References:
    OpenWeatherMap icon list: https://openweathermap.org/api/weather-conditions 
    Weather Icons map to OWM: https://erikflowers.github.io/weather-icons/ 
*/
const ICON_CODES = [
  200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 300, 301, 302, 310, 311,
  312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531, 600,
  601, 602, 611, 612, 615, 616, 620, 621, 622, 701, 711, 721, 731, 741, 761,
  762, 771, 781, 800, 801, 802, 803, 804, 900, 901, 902, 903, 904, 905, 906,
  957,
];

interface WeatherIconProps extends React.HTMLAttributes<HTMLElement> {
  code: number;
  size?: number;
  variant?: "day" | "night";
  className?: string;
}
export const WeatherIcon = ({
  code,
  variant,
  className,
  ...props
}: WeatherIconProps) => {
  const iconClass = `wi-owm-${variant ? variant + "-" : ""}${ICON_CODES.includes(code) ? code : "800"}`;

  return (
    <i
      className={`wi  ${iconClass} ${styles.icon} ${className || ""}`}
      {...props}
    ></i>
  );
};
