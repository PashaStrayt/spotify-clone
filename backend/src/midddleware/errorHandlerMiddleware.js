export const errorHandlerMiddleware = ({ statusCode, message, cause }, request, response, next) => {
  return response.status(statusCode).json({ message, cause });
};