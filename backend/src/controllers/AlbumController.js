import { hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, Singer, Favourite, FavouriteAlbum, Song } from '../database/models.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rm } from 'fs/promises';
import { v4 } from 'uuid';
import { fn, col } from 'sequelize';
import { unlink } from 'fs';


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
      for (let [, { id, name }] of Object.entries(singers)) {
        if ((!id && name) || (id && !name)) {
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
      Object.entries(singers).forEach(async ([, singer]) => {
        await AlbumSinger.create({ albumId: album.id, singerId: singer.id });
      });

      return response.json({ message: 'Альбом успешно создан' });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async edit(request, response, next) {
    try {
      let { id, name, date, singers } = request.body;
      singers = JSON.parse(singers).filter(({ id, name }) => {
        if (id && name) {
          return { id, name };
        }
      });
      const albumId = id;

      await AlbumSinger.destroy({ where: { albumId } });
      singers.forEach(async ({ id: singerId }) => {
        await AlbumSinger.create({ albumId, singerId });
      });

      const album = await Album.upsert({ id, name, date });

      return response.json({ message: 'Альбом успешно изменен' });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getById(request, response, next) {
    try {
      const { id } = request.params;
      const userId = request.query?.userId;

      const album = await Album.findOne({
        where: { id },
        include: { model: Singer, as: 'singers' }
      });

      album.dataValues.songsAmount = await Song.count({ where: { albumId: id } });
      album.dataValues.totalDuration = await Song.sum('duration', { where: { albumId: id } });

      if (userId) {
        const { id: favouriteId } = await Favourite.findOne({ where: { userId } });
        const isFavourite = await FavouriteAlbum.findOne({ where: { favouriteId, albumId: id } });
        album.dataValues.isFavourite = !!isFavourite;
      }

      return response.json(album);
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getMany(request, response, next) {
    try {
      let { limit, page } = request.query;
      limit = Number(limit) || 50;
      page = Number(page) || 1;
      const offset = page * limit - limit;

      const albumsTotalPages = Math.ceil(await Album.count() / limit);
      response.append('Total-Pages', albumsTotalPages);

      let albums = await Album.findAll({
        include: { model: Singer, as: 'singers' },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      await Promise.all(albums.map(async album => {
        const songsAmount = await Song.count({ where: { albumId: album.id } });
        album.dataValues.songsAmount = songsAmount;
        return album;
      }));

      return response.json(albums);
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getEveryFavourite(request, response, next) {
    try {
      const userId = request.user.id;
      let { limit, page } = request.query;
      limit = Number(limit) || 50;
      page = Number(page) || 1;
      const offset = page * limit - limit;

      const albumsTotalPages = Math.ceil(await Favourite.count({ where: { userId } }) / limit);
      response.append('Total-Pages', albumsTotalPages);

      const { id: favouriteId } = await Favourite.findOne({ where: { userId } });

      let albums = await FavouriteAlbum.findAll({
        where: { favouriteId },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      albums = await Promise.all(albums.map(async ({ albumId }) => {
        const album = await Album.findOne({
          where: { id: albumId },
          include: { model: Singer, as: 'singers' }
        });
        const songsAmount = await Song.count({ where: { albumId } });

        album.dataValues.isFavourite = true;
        album.dataValues.songsAmount = songsAmount;
        return album;
      }));

      return response.json(albums);
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async delete(request, response, next) {
    try {
      const { id } = request.params;

      await Album.destroy({ where: { id } });
      await FavouriteAlbum.destroy({ where: { albumId: id } });

      const songs = await Song.findAll({ where: { albumId: id } });
      if (songs && songs?.length) {
        await Promise.all(songs.forEach(async ({ fileName }) => {
          const dirPath = resolve(__dirname, '..', '..', 'static', 'songs', fileName);
          unlink(dirPath, error => {
            if (error) throw error;
          });
        }));
        await Song.destroy({ where: { albumId: id } });
      }

      return response.json({ message: 'Альбом и все входящие в него треки успешно удалены' });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async changeFavourite(request, response, next) {
    try {
      const { id: userId } = request.user;
      let { albumId } = request.query;
      let message;

      const { id: favouriteId } = await Favourite.findOne({ where: { userId } });

      const album = await FavouriteAlbum.findOne({ where: { favouriteId, albumId } });

      if (album) {
        await album.destroy();
        message = 'Альбом успешно удален из избранного';
      } else {
        await FavouriteAlbum.create({ favouriteId, albumId });
        message = 'Альбом успешно добавлен в избранное';
      }

      response.json({ message });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message), request, response);
    }
  }

  static async updateImage(request, response, next) {
    try {
      const { id } = request.body;
      const { image } = request.files;

      const album = await Album.findOne({ where: { id } });

      const dirPath = resolve(__dirname, '..', '..', 'static', 'albums');
      if (album.imageFileName && album.imageFileName !== 'album-image.svg') {
        unlink(resolve(dirPath, album.imageFileName), error => {
          if (error) throw error;
        });
      }
      const imageFileName = v4() + '.jpg';
      image.mv(resolve(dirPath, imageFileName));

      album.imageFileName = imageFileName;
      await album.save({ fields: ['imageFileName'] });

      response.json({ message: 'Фотография альбома успешно заменена', imageFileName });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message), request, response);
    }
  }
}