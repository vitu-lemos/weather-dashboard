import {
  BadGatewayError,
  BadRequestError,
  BandwidthLimitExceededError,
  ForbiddenError,
  GatewayTimeoutError,
  InternalServerError,
  MethodNotAllowedError,
  NotAcceptableError,
  NotFoundError,
  NotImplementedError,
  PayloadTooLargeError,
  RequestTimeoutError,
  ServiceUnavailableError,
  TooManyRequestsError,
  UnauthorizedError,
} from "./errors";

const dumpContext = { requestId: "req-1", userId: 42 };

export const errorMatrix = [
  {
    class: BadRequestError,
    message: "BadRequestError message",
    statusCode: 400,
    context: dumpContext,
  },
  {
    class: UnauthorizedError,
    message: "UnauthorizedError message",
    statusCode: 401,
    context: dumpContext,
  },
  {
    class: ForbiddenError,
    message: "ForbiddenError message",
    statusCode: 403,
    context: dumpContext,
  },
  {
    class: NotFoundError,
    message: "NotFoundError message",
    statusCode: 404,
    context: dumpContext,
  },
  {
    class: MethodNotAllowedError,
    message: "MethodNotAllowedError message",
    statusCode: 405,
    context: dumpContext,
  },
  {
    class: NotAcceptableError,
    message: "NotAcceptableError message",
    statusCode: 406,
    context: dumpContext,
  },
  {
    class: RequestTimeoutError,
    message: "RequestTimeoutError message",
    statusCode: 408,
    context: dumpContext,
  },
  {
    class: PayloadTooLargeError,
    message: "PayloadTooLargeError message",
    statusCode: 413,
    context: dumpContext,
  },
  {
    class: TooManyRequestsError,
    message: "TooManyRequestsError message",
    statusCode: 429,
    context: dumpContext,
  },
  {
    class: InternalServerError,
    message: "InternalServerError message",
    statusCode: 500,
    context: dumpContext,
  },
  {
    class: NotImplementedError,
    message: "NotImplementedError message",
    statusCode: 501,
    context: dumpContext,
  },
  {
    class: BadGatewayError,
    message: "BadGatewayError message",
    statusCode: 502,
    context: dumpContext,
  },
  {
    class: ServiceUnavailableError,
    message: "ServiceUnavailableError message",
    statusCode: 503,
    context: dumpContext,
  },
  {
    class: GatewayTimeoutError,
    message: "GatewayTimeoutError message",
    statusCode: 504,
    context: dumpContext,
  },
  {
    class: BandwidthLimitExceededError,
    message: "BandwidthLimitExceededError message",
    statusCode: 509,
    context: dumpContext,
  },
];
