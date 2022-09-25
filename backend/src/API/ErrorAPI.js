export class ErrorAPI extends Error {
  constructor(statusCode, message, cause) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.cause = cause;
  }

  static badRequest(message) {
    return new ErrorAPI(400, message);
  }

  static unauthorized(message) {
    return new ErrorAPI(401, message);
  }

  static forbidden(message) {
    return new ErrorAPI(403, message);
  }

  static notFound(message) {
    return new ErrorAPI(404, message);
  }

  static internalServer(message) {
    return new ErrorAPI(500, 'Упс! Произошла внутренняя ошибка сервера', message);
  }
}