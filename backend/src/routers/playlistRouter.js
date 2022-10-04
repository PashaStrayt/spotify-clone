import { Router } from "express";
import { PlaylistController } from "../controllers/PlaylistController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";
import { deletePreviewImagesMidddleware } from "../midddleware/deletePreviewImagesMidddleware.js";

const playlistRouter = new Router();

playlistRouter.post(
  '/',
  checkUserMiddleware('ADMIN'),
  deletePreviewImagesMidddleware,
  PlaylistController.create
);
// playlistRouter.post('/edit/:id', checkUserMiddleware('ADMIN'), AlbumController.edit);
playlistRouter.get('/:id', PlaylistController.getOne);
// playlistRouter.get('/', AlbumController.getMany);
// playlistRouter.delete('/:id', checkUserMiddleware('ADMIN'), AlbumController.deleteById);
playlistRouter.post('/change-favourite', checkUserMiddleware(), PlaylistController.changeFavourite);

export { playlistRouter };