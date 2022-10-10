import { Router } from "express";
import { TestController } from "../controllers/TestController.js";

const testRouter = new Router();

testRouter.get('/', TestController.test);

export { testRouter };