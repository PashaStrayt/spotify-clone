import { compareSync, hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, Favourite, FavouriteAlbum, FavouritePlaylist, FavouriteSong, Playlist, Song, User } from '../database/models.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class ImageContoller {
  static async preview(request, response, next) {
    try {
      const image = request.files['0'];
      const fileName = v4() + '.jpg';
      image.mv(resolve(__dirname, '..', '..', 'static', 'image-preview', fileName));
      response.json(fileName);
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }
}