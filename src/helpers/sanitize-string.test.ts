import { describe, expect, it } from "vitest";
import { sanitizeString } from "./sanitize-string";

describe("sanitizeString", () => {
  it("trims leading and trailing whitespace", () => {
    expect(sanitizeString("  New York  ")).toBe("New York");
  });

  it("collapses internal whitespace runs into a single space", () => {
    expect(sanitizeString("New    York")).toBe("New York");
  });

  it("removes commas", () => {
    expect(sanitizeString("New York, NY")).toBe("New York NY");
  });

  it("keeps commas when preserveCommas is true", () => {
    expect(sanitizeString("New York, NY", { preserveCommas: true })).toBe(
      "New York, NY",
    );
  });

  it("removes control characters", () => {
    expect(sanitizeString("New\x00York\x1F\x7F")).toBe("NewYork");
  });

  it("strips newlines and tabs entirely (they are control characters)", () => {
    expect(sanitizeString("New\nYork\tCity")).toBe("NewYorkCity");
  });

  it("leaves an already-clean string unchanged", () => {
    expect(sanitizeString("São Paulo")).toBe("São Paulo");
  });

  it("returns empty string for input that is only whitespace", () => {
    expect(sanitizeString("   ")).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeString("")).toBe("");
  });

  it("strips a full html/script tag", () => {
    expect(sanitizeString("<img src=x onerror=alert(1)>")).toBe("");
  });

  it("strips script tags but keeps inner text content", () => {
    expect(sanitizeString("<script>alert('xss')</script>")).toBe("alert(xss)");
  });

  it("strips quotes and semicolons used in sql injection", () => {
    expect(sanitizeString("1' OR '1'='1'; --")).toBe("1 OR 1=1");
  });

  it("strips sql comment sequences", () => {
    expect(sanitizeString("value/*comment*/more")).toBe("valuecommentmore");
  });

  it("strips backticks", () => {
    expect(sanitizeString("`rm -rf /`")).toBe("rm -rf /");
  });

  it("removes apostrophes from otherwise legitimate names", () => {
    expect(sanitizeString("O'Brien")).toBe("OBrien");
  });
});
