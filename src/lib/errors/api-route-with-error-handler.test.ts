import { describe, expect, it, vi } from "vitest";
import { withErrorHandler } from "./api-route-with-error-handler";
import { NextResponse } from "next/server";
import { errorMatrix } from "./error-matrix.fixture";

describe("withErrorHandler", () => {
  it("returns the handler's response when it succeeds", async () => {
    const handler = withErrorHandler(async () =>
      NextResponse.json({ ok: true }, { status: 200 }),
    );

    const res = await handler();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it.each(errorMatrix)(
    "Map custom errors response correctly ($class.name)",
    async ({ class: ErrorClass, message, statusCode, context }) => {
      const handler = withErrorHandler(async () => {
        throw new ErrorClass(message, context);
      });

      const res = await handler();

      expect(res.status).toBe(statusCode);
      expect(await res.json()).toEqual({ error: message });
    },
  );

  it("maps an unknown error to a generic 500 without leaking its message", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const handler = withErrorHandler(async () => {
      throw new Error("db password is hunter2");
    });

    const res = await handler();

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });

    consoleSpy.mockRestore();
  });
});
