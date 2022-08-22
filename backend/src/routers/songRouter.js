import { Router } from "express";
import { SongController } from "../controllers/SongController.js";

const songRouter = new Router();

songRouter.post('/', SongController.upload);
songRouter.delete( SongController.deleteSongFromPlaylist);
songRouter.delete('/:id', SongController.deleteSongById);
songRouter.post('/update', SongController.update);

export { songRouter };