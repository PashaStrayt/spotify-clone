import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { checkCurrentUserMiddleware } from "../midddleware/checkCurrentUserMiddleware.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";

const userRouter = new Router();

userRouter.post('/registration', UserController.registration);
userRouter.post('/login', UserController.login);
userRouter.post(
  '/update-avatar',
  checkUserMiddleware(),
  checkCurrentUserMiddleware,
  UserController.updateAvatar
);
userRouter.get('/check-auth', checkUserMiddleware(), UserController.checkAuth);
userRouter.get(
  '/favourite',
  checkUserMiddleware(),
  checkCurrentUserMiddleware,
  UserController.getFavourite
);

export { userRouter };