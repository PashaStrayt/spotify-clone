import { Router } from "express";
import { SongController } from "../controllers/SongController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";

const songRouter = new Router();

songRouter.post('/', checkUserMiddleware('ADMIN'), SongController.upload);
songRouter.delete('/:id', checkUserMiddleware('ADMIN'), SongController.deleteById);
songRouter.post('/update', checkUserMiddleware('ADMIN'), SongController.update);
songRouter.get('/get-all', SongController.getAll);
songRouter.get('/get-from-album', SongController.getFromAlbum);
songRouter.post('/change-favourite', checkUserMiddleware(), SongController.changeFavourite);

export { songRouter };