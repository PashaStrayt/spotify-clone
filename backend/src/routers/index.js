import { Router } from "express";
import { albumRouter } from "./albumRouter.js";
import { searchRouter } from "./searchRouter.js";
import { testRouter } from "./testRouter.js";
import { userRouter } from "./userRouter.js";
import { singerRouter } from "./singerRouter.js";
import { songRouter } from "./songRouter.js";
import { checkUserMiddleware } from '../midddleware/checkUserMiddleware.js';

const rootRouter = new Router();

rootRouter.use('/song', checkUserMiddleware('ADMIN'), songRouter);
rootRouter.use('/user', userRouter);
rootRouter.use('/search', searchRouter);
rootRouter.use('/album', albumRouter);
// rootRouter.use('/playlist',);
rootRouter.use('/singer', singerRouter);
rootRouter.use('/test', testRouter);

export { rootRouter };