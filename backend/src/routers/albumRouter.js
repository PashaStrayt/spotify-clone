import { Router } from "express";
import { AlbumController } from "../controllers/AlbumController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";
import { deletePreviewImagesMidddleware } from "../midddleware/deletePreviewImagesMidddleware.js";
import { checkCurrentUserMiddleware } from './../midddleware/checkCurrentUserMiddleware.js';

const albumRouter = new Router();

albumRouter.post('/', checkUserMiddleware('ADMIN'), deletePreviewImagesMidddleware, AlbumController.create);
albumRouter.post('/edit', checkUserMiddleware('ADMIN'), AlbumController.edit);
albumRouter.get('/favourite', checkUserMiddleware(), checkCurrentUserMiddleware, AlbumController.getEveryFavourite);
albumRouter.get('/:id', AlbumController.getById);
albumRouter.get('/', AlbumController.getMany);
albumRouter.delete('/:id', checkUserMiddleware('ADMIN'), AlbumController.delete);
albumRouter.post('/change-favourite', checkUserMiddleware(), AlbumController.changeFavourite);
albumRouter.post('/update-image', checkUserMiddleware('ADMIN'), AlbumController.updateImage);

export { albumRouter };