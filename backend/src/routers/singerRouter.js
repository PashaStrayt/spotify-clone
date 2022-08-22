import { Router } from "express";
import { SingerController } from "../controllers/singerController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";

const singerRouter = new Router();

singerRouter.post('/', checkUserMiddleware('ADMIN'), SingerController.create);

export { singerRouter };