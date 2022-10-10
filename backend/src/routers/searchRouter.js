import { Router } from "express";
import { SearchController } from "../controllers/SearchController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";

const searchRouter = new Router();

searchRouter.get('/simple', SearchController.simpleSearch);
searchRouter.get('/hard/songs', SearchController.chooseSearch);
searchRouter.get('/hard/albums', SearchController.hardSearchAlbums);
// searchRouter.get('/', checkUserMiddleware('ADMIN'), SearchController.search);

export { searchRouter };