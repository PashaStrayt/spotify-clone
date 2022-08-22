export const errorHandlerMiddleware = (error, request, response, next) => {
  return response.status(error.statusCode).json({message: error.message});
};