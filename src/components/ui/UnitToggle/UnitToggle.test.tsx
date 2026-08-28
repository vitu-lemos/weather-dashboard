import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnitToggle } from "./UnitToggle";

function getButton(label: string) {
  return screen.getByRole("button", { name: label });
}

describe("UnitToggle", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("marks the button matching the units prop as on", () => {
    render(<UnitToggle units="imperial" onChange={vi.fn()} />);

    expect(getButton("Switch to imperial units").dataset.state).toBe("on");
    expect(getButton("Switch to metric units").dataset.state).toBe("off");
  });

  it("calls onChange with the clicked unit", () => {
    const onChange = vi.fn();
    render(<UnitToggle units="metric" onChange={onChange} />);

    fireEvent.click(getButton("Switch to imperial units"));

    expect(onChange).toHaveBeenCalledWith("imperial");
  });

  it("follows the units prop when it changes externally, e.g. browser back/forward", () => {
    const { rerender } = render(
      <UnitToggle units="metric" onChange={vi.fn()} />,
    );
    expect(getButton("Switch to metric units").dataset.state).toBe("on");

    rerender(<UnitToggle units="imperial" onChange={vi.fn()} />);

    expect(getButton("Switch to imperial units").dataset.state).toBe("on");
    expect(getButton("Switch to metric units").dataset.state).toBe("off");
  });
});
