import { config } from "dotenv";
import express from 'express';
import { errorHandlerMiddleware } from "./midddleware/errorHandlerMiddleware.js";
import { rootRouter } from "./routers/index.js";
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fileUpload from "express-fileupload";
import { database } from "./database/index.js";
import * as models from './database/models.js'

config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const server = express();

server.use(express.json());
server.use(fileUpload({}));
server.use(express.static(resolve(__dirname, '..', 'static', 'image-preview')));
server.use(express.static(resolve(__dirname, '..', 'static', 'songs')));
server.use(express.static(resolve(__dirname, '..', 'static', 'users')));
server.use(express.static(resolve(__dirname, '..', 'static', 'UI')));
server.use('/api', rootRouter);
server.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    await database.authenticate();
    await database.sync({ alter: true });
    server.listen(PORT, () => console.log(`Server was started on the PORT = ${PORT}`));
  }
  catch ({ message }) {
    console.log({ message });
  }
};

startServer();

export { server };