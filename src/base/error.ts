export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  AUTH = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export default class BaseError extends Error {
  constructor(
    readonly name: string,
    readonly description = "internal server error",
    readonly httpCode: HttpStatusCode = 500,
    readonly isOperational = true
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
