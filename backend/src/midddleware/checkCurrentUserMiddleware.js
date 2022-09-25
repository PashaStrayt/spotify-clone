export const checkCurrentUserMiddleware = (request, response, next) => {
  try {
    const id = request.query.id || request.body.id || request.cookies.userId;

    if (id != request.user.id) {
      return response.status(403).json({ message: 'Нет доступа' });
    }

    return next();
  }
  catch (error) {
    return response.status(500).json({ message: error.message });
  }
}