import { Router } from "express";
import { AlbumController } from "../controllers/AlbumController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";

const playlistRouter = new Router();

// playlistRouter.post('/', checkUserMiddleware('ADMIN'), AlbumController.create);
// playlistRouter.post('/edit/:id', checkUserMiddleware('ADMIN'), AlbumController.edit);
// playlistRouter.get('/:id', AlbumController.getById);
// playlistRouter.get('/', AlbumController.getMany);
// playlistRouter.delete('/:id', checkUserMiddleware('ADMIN'), AlbumController.deleteById);

export { playlistRouter };