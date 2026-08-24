type ContextObj = Record<string, unknown>;

export type CustomErrorContent<C extends ContextObj> = {
  message: string;
  context?: C;
};

export class CustomError<C extends ContextObj = ContextObj> extends Error {
  readonly statusCode: number;
  readonly context?: C;
  /**
   * Creates an instance of AppError.
   *
   * @param {string} [message='An error occurred.'] - The error message.
   * @param {number} [statusCode=500] - The HTTP status code associated with the error.
   * @param {string} [name='CustomError'] - The name of the error.
   * @param {C} [context] - error extra context
   */
  constructor(
    message = "An error occurred.",
    statusCode = 500,
    name = "CustomError",
    context?: C,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.context = context;
    Error.captureStackTrace?.(this, new.target);
  }
}

/**
 * Bad Request error (HTTP 400).
 *
 * @extends CustomError
 */
export class BadRequestError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "It seems there was an error with your request. Please check the data you entered and try again.",
    context?: C,
  ) {
    super(message, 400, "BadRequestError", context);
  }
}

/**
 *  Unauthorized error (HTTP 401).
 *
 * @extends CustomError
 */
export class UnauthorizedError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "Unauthorized access. Please log in again.",
    context?: C,
  ) {
    super(message, 401, "UnauthorizedError", context);
  }
}

/**
 * Forbidden error (HTTP 403).
 *
 * @extends CustomError
 */
export class ForbiddenError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(message = "Access denied.", context?: C) {
    super(message, 403, "ForbiddenError", context);
  }
}

/**
 * Not Found error (HTTP 404).
 *
 * @extends CustomError
 */
export class NotFoundError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(message = "The requested resource was not found.", context?: C) {
    super(message, 404, "NotFoundError", context);
  }
}

/**
 * Method Not Allowed error (HTTP 405).
 *
 * @extends CustomError
 */
export class MethodNotAllowedError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "The HTTP method used is not allowed for this resource.",
    context?: C,
  ) {
    super(message, 405, "MethodNotAllowedError", context);
  }
}

/**
 * Not Acceptable error (HTTP 406).
 *
 * @extends CustomError
 */
export class NotAcceptableError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "The requested resource is not available in a format acceptable to your browser.",
    context?: C,
  ) {
    super(message, 406, "NotAcceptableError", context);
  }
}

/**
 * Request Timeout error (HTTP 408).
 *
 * @extends CustomError
 */
export class RequestTimeoutError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "The server timed out waiting for your request.",
    context?: C,
  ) {
    super(message, 408, "RequestTimeoutError", context);
  }
}

/**
 * Payload Too Large error (HTTP 413).
 *
 * @extends CustomError
 */
export class PayloadTooLargeError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(message = "The request payload is too large.", context?: C) {
    super(message, 413, "PayloadTooLargeError", context);
  }
}

/**
 * Too Many Requests error (HTTP 429).
 *
 * @extends CustomError
 */
export class TooManyRequestsError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "You have made too many requests in a short period of time.",
    context?: C,
  ) {
    super(message, 429, "TooManyRequestsError", context);
  }
}

/**
 *  Internal Server Error (HTTP 500).
 *
 * @extends CustomError
 */
export class InternalServerError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "An internal server error occurred. Please try again later.",
    context?: C,
  ) {
    super(message, 500, "InternalServerError", context);
  }
}

/**
 * Not Implemented error (HTTP 501).
 *
 * @extends CustomError
 */
export class NotImplementedError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "This functionality has not been implemented.",
    context?: C,
  ) {
    super(message, 501, "NotImplementedError", context);
  }
}

/**
 * Bad Gateway error (HTTP 502).
 *
 * @extends CustomError
 */
export class BadGatewayError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "Received an invalid response from the upstream server.",
    context?: C,
  ) {
    super(message, 502, "BadGatewayError", context);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Service Unavailable error (HTTP 503).
 *
 * @extends CustomError
 */
export class ServiceUnavailableError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(message = "The service is currently unavailable.", context?: C) {
    super(message, 503, "ServiceUnavailableError", context);
  }
}

/**
 * Gateway Timeout error (HTTP 504).
 *
 * @extends CustomError
 */
export class GatewayTimeoutError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(
    message = "The upstream server failed to send a request in time.",
    context?: C,
  ) {
    super(message, 504, "GatewayTimeoutError", context);
  }
}

/**
 * Bandwidth Limit Exceeded error (HTTP 509).
 *
 * @extends CustomError
 */
export class BandwidthLimitExceededError<
  C extends ContextObj = ContextObj,
> extends CustomError<C> {
  constructor(message = "Bandwidth limit exceeded.", context?: C) {
    super(message, 509, "BandwidthLimitExceededError", context);
  }
}
