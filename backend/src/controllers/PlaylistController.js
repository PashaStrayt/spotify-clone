import { hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, Playlist, Song, SongSinger, User } from '../database/models.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rm } from 'fs/promises';
import { v4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class PlaylistController {
  static async create(request, response, next) {
    try {
      const { name } = request.body;
      const image = request?.files?.image;
      let imageFileName;

      if (!name) {
        return next(ErrorAPI.badRequest('Название не может быть пустым'));
      }

      if (image) {
        imageFileName = v4() + '.jpg';
        image.mv(resolve(__dirname, '..', '..', 'static', 'playlists', imageFileName));
      } else {
        imageFileName = 'playlist-image.svg';
      }

      const playlist = await Playlist.create({ name, imageFileName });

      return response.json(playlist);
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }
}