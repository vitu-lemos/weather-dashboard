import { describe, expect, it, vi } from "vitest";
import { safeLoad } from "./server-request-with-error-handler";
import { CustomError } from "./errors";
import { errorMatrix } from "./error-matrix.fixture";

describe("safeLoad", () => {
  it("returns the resolved value on success", async () => {
    const result = await safeLoad(async () => ({ city: "New York" }));

    expect(result).toEqual({
      success: true,
      data: { city: "New York" },
    });
  });

  it.each(errorMatrix)(
    "maps $class.name to its status code and message",
    async ({ class: ErrorClass, message, statusCode, context }) => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await safeLoad(async () => {
        throw new ErrorClass(message, context);
      });

      expect(result).toEqual({
        success: false,
        message,
        status: statusCode,
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[${ErrorClass.name}]`),
      );

      consoleSpy.mockRestore();
    },
  );

  it("defaults to a 500 status for a bare CustomError with no explicit status code", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await safeLoad(async () => {
      throw new CustomError();
    });

    expect(result).toEqual({
      success: false,
      message: "An error occurred.",
      status: 500,
    });

    consoleSpy.mockRestore();
  });

  it("maps a non-CustomError Error to a generic 500 without leaking its message", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await safeLoad(async () => {
      throw new Error("db password is hunter2");
    });

    expect(result).toEqual({
      success: false,
      message: "Internal server error",
      status: 500,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unhandled route error:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("maps a thrown non-Error value to a generic 500", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await safeLoad(async () => {
      throw "boom";
    });

    expect(result).toEqual({
      success: false,
      message: "Internal server error",
      status: 500,
    });

    consoleSpy.mockRestore();
  });
});
