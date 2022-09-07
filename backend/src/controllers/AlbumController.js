import { hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, Song, SongSinger, User } from '../database/models.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rm } from 'fs/promises';
import { v4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class AlbumController {
  static async create(request, response, next) {
    try {
      const { name, date } = request.body;
      const singers = JSON.parse(request.body.singers);
      const image = request?.files?.image;
      let imageFileName;

      if (!name) {
        return next(ErrorAPI.badRequest('Название не может быть пустым'));
      }
      if (!date || date?.length !== 4) {
        return next(ErrorAPI.badRequest('Введите корректный год выпуска в формате "xxxx"'));
      }
      for (let singer of singers) {
        if (!singer.id) {
          return next(ErrorAPI.badRequest('Все исполнители должны быть выбраны с помощью подсказок'));
        }
      }

      if (image) {
        imageFileName = v4() + '.jpg';
        image.mv(resolve(__dirname, '..', '..', 'static', 'albums', imageFileName));
      } else {
        imageFileName = 'album-image.svg';
      }

      const album = await Album.create({ name, date, imageFileName });
      singers.forEach(async singer => {
        await AlbumSinger.create({ albumId: album.id, singerId: singer.id });
      });

      return response.json(album);
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async edit(request, response, next) {
    try {
      const { id, name, date, singersId } = request.body;
      const image = request?.files?.image;

      if (image) {
        const { image: fileName } = await Album.findOne({ where: { id } });
        const path = resolve(__dirname, '..', '..', 'static', 'images', fileName);
        // await rm(path);
        image.mv(path);
      }

      if (singersId) {
        await AlbumSinger.destroy({ where: { albumId: id } });
        singersId.forEach(async singerId => {
          await AlbumSinger.create({ albumId: id, singerId });
        });
      }

      const album = await Album.upsert({ id, name, date })

      return response.json(album);
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getById(request, response, next) {
    try {
      const { id } = request.params;

      const album = await Album.findOne({
        where: { id },
        include: { model: AlbumSinger, as: 'albumSingers' }
      });

      const songs = await Song.findAll({ where: { albumId: id } });
      const songSingers = songs.map(async song => {
        await SongSinger.findAll({ where: { songId: song.id } });
      });

      return response.json({ ...album, songs, songSingers });
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getMany(request, response, next) {
    try {
      let { limit, page } = request.query;
      limit = limit || 20;
      page = page || 1;
      const offset = page * limit - limit;

      const albums = await Album.findAll({
        include: { model: AlbumSinger, as: 'albumSingers' },
        limit,
        offset
      });

      return response.json(albums);
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async deleteById(request, response, next) {
    try {
      let { id } = request.params;

      const album = await Album.destroy({ where: { id } });

      return response.json(album);
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }
}