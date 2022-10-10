import { config } from "dotenv";
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandlerMiddleware } from "./midddleware/errorHandlerMiddleware.js";
import { rootRouter } from "./routers/index.js";
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fileUpload from "express-fileupload";
import { database } from "./database/index.js";
import * as models from './database/models.js'

config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT;
const server = express();

server.use(express.json());
server.use(cookieParser());
server.use(fileUpload({}));
const folders = ['albums', 'image-preview', 'playlists', 'songs', 'UI', 'users', 'singers'];
for (let folder of folders) {
  server.use(express.static(resolve(__dirname, '..', 'static', folder)));
}
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