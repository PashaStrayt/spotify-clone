import { hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Song, AlbumSinger, Playlist, FavouritePlaylist, SongPlaylist, SongPrivatePlaylist, SongPrivate, SongSinger, Singer } from '../database/models.js';
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

      return response.json({ message: 'Плейлист успешно создан' });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getOne(request, response, next) {
    try {
      const { id } = request.params;
      const userId = request.query?.userId;
      let duration = 0;
      let singers = [];

      const playlist = await Playlist.findOne({ where: { id } });

      const songs = await SongPlaylist.findAll({ where: { playlistId: id } });
      const privateSongs = await SongPrivatePlaylist.findAll({ where: { playlistId: id } });

      if (songs && songs?.length) {
        await Promise.all(songs.map(async ({ songId }) => {
          const { duration: iterableDuration } = await Song.findOne({ where: { id: songId } });
          duration += iterableDuration;

          const foundSingers = await SongSinger.findAll({ where: { songId } });
          await Promise.all(foundSingers.map(async ({ singerId }) => {
            const { id, name } = await Singer.findOne({ where: { id: singerId } });

            const isSingerIncluded = singers.some(singer => {
              return id === singer.id && name === singer.name;
            });
            if (!isSingerIncluded) {
              singers.push({ id, name });
            }
          }));
        }));
      }
      if (privateSongs && privateSongs?.length) {
        await Promise.all(privateSongs.map(async ({ songPrivateId }) => {
          const { singersNames, duration: iterableDuration } = await SongPrivate.findOne({
            where: { id: songPrivateId }
          });
          duration += iterableDuration;

          const id = null;
          singersNames.forEach(name => {
            const isSingerIncluded = singers.some(singer => {
              return id === singer.id && name === singer.name;
            });
            if (!isSingerIncluded) {
              singers.push({ id, name });
            }
          });
        }));
      }

      playlist.dataValues.singers = singers;
      playlist.dataValues.duration = duration;

      return response.json(playlist);
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async changeFavourite(request, response, next) {
    try {
      const { id: userId } = request.user;
      let { playlistId } = request.query;
      let message;

      const { id: favouriteId } = await Favourite.findOne({ where: { userId } });

      const playlist = await FavouritePlaylist.findOne({ where: { favouriteId, playlistId } });

      if (playlist) {
        await playlist.destroy();
        message = 'Плейлист успешно удален из избранного';
      } else {
        await FavouritePlaylist.create({ favouriteId, playlistId });
        message = 'Плейлист успешно добавлен в избранное';
      }

      response.json({ message });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message), request, response);
    }
  }
}