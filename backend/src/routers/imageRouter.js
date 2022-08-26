import { Router } from "express";
import { ImageContoller } from "../controllers/ImageContoller.js";

const imageRouter = new Router();

imageRouter.post('/preview', ImageContoller.preview);

export { imageRouter };