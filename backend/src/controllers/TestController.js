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
      await SongPlaylist.create({ songId: 20, playlistId: 1 });
      await SongPlaylist.create({ songId: 28, playlistId: 1 });
      await SongPlaylist.create({ songId: 34, playlistId: 1 });

      return response.json({ message: 'SUCCESS' });
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }
}