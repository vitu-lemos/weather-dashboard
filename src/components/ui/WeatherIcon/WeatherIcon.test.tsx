import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { WeatherIcon } from "./WeatherIcon";

describe("WeatherIcon", () => {
  it("renders the correct icon for a given code", () => {
    const { container } = render(<WeatherIcon code={200} />);
    const icon = container.querySelector("i");

    expect(icon?.className).toContain("wi-owm-200");
  });

  it("renders the icon with the correct variant", () => {
    const { container: nightContainer } = render(
      <WeatherIcon code={800} variant="night" />,
    );
    const { container: dailyContainer } = render(
      <WeatherIcon code={800} variant="day" />,
    );
    const { container: neutralContainer } = render(<WeatherIcon code={800} />);
    const nightIcon = nightContainer.querySelector("i");
    const dailyIcon = dailyContainer.querySelector("i");
    const neutralIcon = neutralContainer.querySelector("i");

    expect(dailyIcon?.className).toContain("wi-owm-day-800");
    expect(nightIcon?.className).toContain("wi-owm-night-800");
    expect(neutralIcon?.className).toContain("wi-owm-800");
  });

  it("renders the default icon (800) if code does not match ICON_CODES", () => {
    const { container } = render(<WeatherIcon code={999} />);
    const icon = container.querySelector("i");

    expect(icon?.className).toContain("wi-owm-800");
  });

  it("accepts custom classNames", () => {
    const { container } = render(
      <WeatherIcon code={800} className="custom-class" />,
    );
    const icon = container.querySelector("i");

    expect(icon?.className).toContain("custom-class");
  });

  it("accepts custom styles", () => {
    const { container } = render(
      <WeatherIcon code={800} style={{ color: "red" }} />,
    );
    const icon = container.querySelector("i");

    expect(icon?.style.color).toBe("red");
  });

  it("accepts custom html attributes", () => {
    const { container } = render(
      <WeatherIcon code={800} data-testid="weather-icon" aria-label="sunny" />,
    );
    const icon = container.querySelector("i");

    expect(icon?.getAttribute("data-testid")).toBe("weather-icon");
    expect(icon?.getAttribute("aria-label")).toBe("sunny");
  });
});
