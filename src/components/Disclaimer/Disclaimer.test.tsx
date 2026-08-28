import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Disclaimer } from "./Disclaimer";

describe("Disclaimer", () => {
  it("renders both disclaimer text blocks", () => {
    render(<Disclaimer />);

    expect(
      screen.getByText(/for general informational purposes only/i),
    ).toBeTruthy();
    expect(
      screen.getByText(/consult official government sources/i),
    ).toBeTruthy();
    expect(
      screen.getByText(/assume full responsibility/i),
    ).toBeTruthy();
  });
});
