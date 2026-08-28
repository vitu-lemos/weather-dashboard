import { CustomError } from "./errors";

export type ResponseResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; status: number };

export async function safeLoad<T>(
  fn: () => Promise<T>,
): Promise<ResponseResult<T>> {
  try {
    return { success: true, data: await fn() };
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(
        `[${error.name}] - ${error.message} - context ${JSON.stringify(error)} `,
      );
      return {
        success: false,
        message: error.message,
        status: error.statusCode ?? 500,
      };
    }
    console.error("Unhandled route error:", error);
    return { success: false, message: "Internal server error", status: 500 };
  }
}
