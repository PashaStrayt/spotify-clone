import { Router } from "express";
import { albumRouter } from "./albumRouter.js";
import { searchRouter } from "./searchRouter.js";
import { testRouter } from "./testRouter.js";
import { userRouter } from "./userRouter.js";
import { singerRouter } from "./singerRouter.js";
import { songRouter } from "./songRouter.js";
import { imageRouter } from "./imageRouter.js";
import { playlistRouter } from "./playlistRouter.js";

const rootRouter = new Router();

rootRouter.use('/song', songRouter);
rootRouter.use('/user', userRouter);
rootRouter.use('/search', searchRouter);
rootRouter.use('/album', albumRouter);
rootRouter.use('/playlist', playlistRouter);
rootRouter.use('/singer', singerRouter);
rootRouter.use('/test', testRouter);
rootRouter.use('/image', imageRouter);

export { rootRouter };