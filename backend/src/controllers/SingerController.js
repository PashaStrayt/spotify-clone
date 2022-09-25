import { hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, Singer, Song, SongSinger, User } from '../database/models.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rm } from 'fs/promises';

export class SingerController {
  static async create(request, response, next) {
    try {
      const { name } = request.body;
      const image = request?.files?.image;
      let imageFileName;

      if (image) {
        imageFileName = v4() + '.jpg';
        image.mv(resolve(__dirname, '..', '..', 'static', 'singers', imageFileName));
      } else {
        imageFileName = 'singer-image.svg';
      }

      const singer = await Singer.create({ name, imageFileName });

      return response.json({message: 'Исполнитель успешно создан'});
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }
}