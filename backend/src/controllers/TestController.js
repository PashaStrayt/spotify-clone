import { Op } from 'sequelize';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { FavouriteSong, FavouriteSongPrivate, Singer, Song, SongPlaylist, SongPrivate, SongPrivatePlaylist, SongSinger } from '../database/models.js'
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { v4 } from 'uuid';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { config } from 'dotenv';

config();
const __dirname = dirname(fileURLToPath(import.meta.url));

export class TestController {
  static async test(request, response, next) {
    try {
      return response.json({ message: 'Я тебя люлю, Настюша <3' });
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }
}