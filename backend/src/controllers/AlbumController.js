import { hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, Song, SongSinger, User } from '../database/models.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rm } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class AlbumController {
  static async create(request, response, next) {
    try {
      const { name, date, singersId } = request.body;
      // const image = request.files.image;

      const album = await Album.create({ name, date });
      singersId.forEach(async singerId => {
        await AlbumSinger.create({ albumId: album.id, singerId });
      });

      // const fileName = album.id + '.jpg';
      // image.mv(resolve(__dirname, '..', '..', 'static', 'images', fileName));

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