import { Router } from "express";
import { AlbumController } from "../controllers/AlbumController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";
import { deletePreviewImagesMidddleware } from "../midddleware/deletePreviewImagesMidddleware.js";

const albumRouter = new Router();

albumRouter.post('/', checkUserMiddleware('ADMIN'), deletePreviewImagesMidddleware, AlbumController.create);
albumRouter.post('/edit/:id', checkUserMiddleware('ADMIN'), AlbumController.edit);
albumRouter.get('/:id', AlbumController.getById);
albumRouter.get('/', AlbumController.getMany);
albumRouter.delete('/:id', checkUserMiddleware('ADMIN'), AlbumController.deleteById);

export { albumRouter };