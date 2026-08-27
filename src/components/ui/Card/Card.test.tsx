import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

describe("Card", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders composed header, title, and content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>New York</CardTitle>
        </CardHeader>
        <CardContent>72°</CardContent>
      </Card>,
    );

    expect(screen.getByText("New York")).toBeDefined();
    expect(screen.getByText("72°")).toBeDefined();
  });
});
