import { describe, expect, it } from "vitest";
import { CustomError } from "./errors";
import { errorMatrix } from "./error-matrix.fixture";

const dumpContext = { requestId: "req-1", userId: 42 };

describe("Error Classes classes", () => {
  it("CustomError should have correct properties", () => {
    const error = new CustomError(
      "CustomError message",
      500,
      "CustomError",
      dumpContext,
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("CustomError");
    expect(error.message).toBe("CustomError message");
    expect(error.statusCode).toBe(500);
    expect(error.context).toEqual(dumpContext);
  });

  it.each(errorMatrix)(
    "$class.name should have correct properties",
    ({ class: ErrorClass, message, statusCode, context }) => {
      const error = new ErrorClass(message, context);

      expect(error).toBeInstanceOf(CustomError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe(ErrorClass.name);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.context).toEqual(context);
    },
  );
});
