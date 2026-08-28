import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppHeaderSkeleton } from "./AppHeaderSkeleton";

describe("AppHeaderSkeleton", () => {
  it("renders a status region announcing the loading state", () => {
    render(<AppHeaderSkeleton />);

    expect(screen.getByRole("status", { name: "Loading header" })).toBeTruthy();
  });
});
