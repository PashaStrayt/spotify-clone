import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

export const checkUserMiddleware = role => {
  return (request, response, next) => {
    try {
      if (!request.headers?.authorization) {
        return response.status(401).json({message: 'Не авторизован'});
      }
      const token = request.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!decoded) {
        return response.status(401).json({message: 'Не авторизован'});
      }
      if (!role) {
        request.user = decoded;
        return next();
      }
      if (decoded.role !== role) {
        return response.status(403).json({message: 'Нет доступа'});
      }
      request.user = decoded;
      return next();
    }
    catch(error) {
      return response.status(500).json({message: error.message});
    }
  };
};