import { Router } from "express";
import { SearchController } from "../controllers/SearchController.js";
import { checkUserMiddleware } from "../midddleware/checkUserMiddleware.js";

const searchRouter = new Router();

searchRouter.get('/simple', SearchController.simpleSearch);
searchRouter.get('/hard', SearchController.hardSearch);
// searchRouter.get('/', checkUserMiddleware('ADMIN'), SearchController.search);

export { searchRouter };