import { Router } from "express";
import { TestController } from "../controllers/testController.js";

const testRouter = new Router();

testRouter.get('/', TestController.test);

export { testRouter };