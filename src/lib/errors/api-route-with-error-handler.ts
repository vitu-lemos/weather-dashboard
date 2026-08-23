import { NextResponse } from "next/server";
import { CustomError } from "@/lib/errors/errors";

export function withErrorHandler<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof CustomError) {
        console.error(
          `[${error.name}] - ${error.message} - context ${JSON.stringify(error)} `,
        );
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode },
        );
      }

      console.error("Unhandled route error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  };
}
