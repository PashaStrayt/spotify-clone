import { Router } from "express";
import { SingerController } from "../controllers/SingerController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";
import { deletePreviewImagesMidddleware } from "../midddleware/deletePreviewImagesMidddleware.js";

const singerRouter = new Router();

singerRouter.post('/', checkUserMiddleware('ADMIN'), deletePreviewImagesMidddleware, SingerController.create);

export { singerRouter };