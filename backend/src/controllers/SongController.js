import { config } from 'dotenv';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, Favourite, FavouriteSong, FavouriteSongPrivate, Singer, Song, SongPlaylist, SongPrivate, SongPrivatePlaylist, SongSinger, User } from '../database/models.js';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 } from 'uuid';
import { copyFile, readdir, readdirSync, unlink } from 'fs';

config();
const __dirname = dirname(fileURLToPath(import.meta.url));

export class SongController {
  static upload(request, response, next) {
    try {
      const songsInfo = JSON.parse(request.body.songsInfo);
      const songsFiles = request.files;

      if (!songsFiles) {
        return next(ErrorAPI.badRequest('Файлы не были приложены'));
      }

      Object.entries(songsFiles).forEach(async (song, index) => {
        const {
          name,
          albumId,
          singers,
          albumName,
          format
        } = songsInfo[index];

        const fileName = v4() + '.' + format;
        song[1].mv(resolve(__dirname, '..', '..', 'static', 'songs', fileName));

        const path = `http://localhost:${process.env.PORT}/${fileName}`;
        let duration = await getAudioDurationInSeconds(path);
        duration = Math.floor(duration);

        let hasOnlyExistingSingers = true;
        let singersIds = [], singersNames = [];
        for (let [property, value] of Object.entries(singers)) {
          if (value.id) {
            singersIds.push(value.id);
            singersNames.push(value.name ? value.name : 'Не известен');
          } else {
            if (value.name) {
              singersNames.push(value.name);
              hasOnlyExistingSingers = false;
            }
          }
        }

        if (albumId && hasOnlyExistingSingers) {
          const song = await Song.create({
            name, albumId, format, duration, fileName
          });
          for (let singerId of singersIds) {
            await SongSinger.create({
              songId: song.id, singerId
            });
          }
        } else {
          if (!singersNames.length) {
            singersNames = ['Не известен']
          }
          await SongPrivate.create({
            name, singersNames, albumName: albumName || 'Без альбома', format, duration, fileName
          });
        }
      });

      return response.json({ message: 'Трек(и) успешно загружен(ы)' });
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async deleteSongFromPlaylist(request, response, next) {
    try {
      const { songId, songPrivateId, playlistId } = request.query;

      if (songId) {
        await SongPlaylist.destroy({
          where: { songId, playlistId }
        });
      } else if (songPrivateId) {
        await SongPrivatePlaylist.destroy({
          where: { songPrivateId, playlistId }
        });
      }

      return response.json({ message: 'SUCCESS' });
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async deleteById(request, response, next) {
    try {
      const { id } = request.params;
      const { isPrivate, userId } = request.query;

      const { id: favouriteId } = await Favourite.findOne({ where: { userId } });
      console.log(favouriteId);

      let fileName;
      if (isPrivate === 'true') {
        const song = await SongPrivate.findOne({ where: { id } });
        fileName = song.fileName;

        await song.destroy();
        await FavouriteSongPrivate.destroy({ where: { favouriteId, songPrivateId: id } })
      } else {
        const song = await Song.findOne({ where: { id } });
        fileName = song.fileName;

        await song.destroy();
        await SongSinger.destroy({ where: { songId: id } });
        await FavouriteSong.destroy({ where: { favouriteId, songId: id } });
      }

      const path = resolve(__dirname, '..', '..', 'static', 'songs', fileName);
      unlink(path, error => {
        if (error) throw error;
      });

      return response.json({ message: 'Трек успешно полностью удален' });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async update(request, response, next) {
    try {
      const {
        id,
        name,
        albumName,
        albumId,
        singers,
        wasPrivate
      } = request.body;

      let hasOnlyExistingSingers = true;
      let singersIds = [], singersNames = [];
      for (let [property, value] of Object.entries(singers)) {
        if (value.id) {
          singersIds.push(value.id);
          singersNames.push(value.name ? value.name : 'Не известен');
        } else {
          if (value.name) {
            singersNames.push(value.name);
            hasOnlyExistingSingers = false;
          }
        }
      }

      let song;
      let album;
      if (wasPrivate) {
        if (hasOnlyExistingSingers && albumId) {
          const { format, duration, fileName } = await SongPrivate.findOne(
            { where: { id } }
          );
          await SongPrivate.destroy({ where: { id } })

          song = await Song.create({
            name, albumId, format, duration, fileName
          });
          for (let singerId of singersIds) {
            await SongSinger.create({
              songId: song.id, singerId
            });
          }
          album = await Album.findOne({
            where: { id: song.albumId },
            attributes: ['imageFileName'],

          });
        } else {
          song = await SongPrivate.findOne({ where: { id } });

          song.name = name;
          song.singersNames = singersNames?.length ? singersNames : ['Не известен'];
          song.albumName = albumName || 'Без альбома';

          await song.save({ fields: ['name', 'singersNames', 'albumName'] });
        }
      } else {
        if (hasOnlyExistingSingers && albumId) {
          await SongSinger.destroy({ where: { songId: id } });

          for (let singerId of singersIds) {
            await SongSinger.create({
              songId: id, singerId
            });
          }

          song = await Song.findOne({ where: { id } });
          song.name = name;
          song.albumId = albumId;
          await song.save({ fields: ['name', 'albumId'] });

          album = await Album.findOne({
            where: { id: albumId },
            attributes: ['imageFileName']
          });
        } else {
          await SongSinger.destroy({ where: { songId: id } });

          const { format, duration, fileName } = await Song.findOne({ where: { id } });

          await Song.destroy({ where: { id } });

          song = await SongPrivate.create({
            name, singersNames: singersNames?.length ? singersNames : ['Не известен'], albumName: albumName || 'Без альбома', format, duration, fileName
          });
        }
      }

      return response.json({
        ...song.dataValues,
        albumImage: album?.imageFileName || 'album-image.svg',
        message: 'Данные трека успешно обновлены'
      });
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getAll(request, response, next) {
    try {
      let { userId, limit, page } = request.query;
      limit = limit || 50;
      page = page || 1;
      const offset = limit * page - limit;
      const order = [['createdAt', 'DESC']];

      const SongsTotalPages = Math.ceil(await Song.count() / 10);
      const SongPrivatesTotalPages = Math.ceil(await SongPrivate.count() / 10);
      response.append('Total-Pages', SongsTotalPages > SongPrivatesTotalPages ? SongsTotalPages : SongPrivatesTotalPages);

      let songs = await Song.findAll({
        order, limit, offset,
        include: [
          { model: Singer, as: 'SongSinger', attributes: ['name'] },
          { model: Album, attributes: ['name', 'imageFileName'] }
        ]
      });
      let songsPrivate = await SongPrivate.findAll({ order, limit, offset });

      if (userId) {
        const { id: favouriteId } = await Favourite.findOne({ where: { userId } });
        const favouriteSongs = await FavouriteSong.findAll({ where: { favouriteId } });
        const favouriteSongsPrivate = await FavouriteSongPrivate.findAll({ where: { favouriteId } });

        if (favouriteSongs.length) {
          songs.forEach(song => {
            let isFavourite = false;
            for (let favouriteSong of favouriteSongs) {
              if (favouriteSong.songId === song.id) {
                isFavourite = true;
                break;
              }
            }
            song.dataValues.isFavourite = isFavourite
          });
        }
        if (favouriteSongsPrivate.length) {
          songsPrivate.forEach(songPrivate => {
            let isFavourite = false;
            for (let favouriteSongPrivate of favouriteSongsPrivate) {
              if (favouriteSongPrivate.songPrivateId === songPrivate.id) {
                isFavourite = true;
                break;
              }
            }
            songPrivate.dataValues.isFavourite = isFavourite
          });
        }
      }

      response.json([...songs, ...songsPrivate]);
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.badRequest(error.message));
    }
  }

  static async getFromAlbum(request, response, next) {
    try {
      let { albumId, userId, limit, page } = request.query;
      limit = limit || 100;
      page = page || 1;
      const offset = limit * page - limit;
      const order = [['createdAt', 'DESC']];

      const SongsTotalPages = Math.ceil(await Song.count() / 10);
      response.append('Total-Pages', SongsTotalPages);

      let songs = await Song.findAll({
        where: { albumId },
        order, limit, offset,
        include: [
          { model: Singer, as: 'SongSinger', attributes: ['name'] },
          { model: Album, attributes: ['name', 'imageFileName'] }
        ]
      });

      if (userId) {
        const { id: favouriteId } = await Favourite.findOne({ where: { userId } });
        const favouriteSongs = await FavouriteSong.findAll({ where: { favouriteId } });

        if (favouriteSongs.length) {
          songs.forEach(song => {
            let isFavourite = false;
            for (let favouriteSong of favouriteSongs) {
              if (favouriteSong.songId === song.id) {
                isFavourite = true;
                break;
              }
            }
            song.dataValues.isFavourite = isFavourite
          });
        }
      }

      response.json(songs);
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.badRequest(error.message));
    }
  }

  static async changeFavourite(request, response, next) {
    try {
      let { userId, songId, isPrivate } = request.query;
      const { id: favouriteId } = await Favourite.findOne({ where: { userId } });
      let favouriteSong;

      if (isPrivate === 'true') {
        favouriteSong = await FavouriteSongPrivate.findOne({
          where: {
            favouriteId, songPrivateId: songId
          }
        });
        if (favouriteSong) {
          favouriteSong.destroy();
        } else {
          favouriteSong = await FavouriteSongPrivate.create({ favouriteId, songPrivateId: songId });
        }
      } else {
        favouriteSong = await FavouriteSong.findOne({
          where: {
            favouriteId, songId
          }
        });
        if (favouriteSong) {
          favouriteSong.destroy();
        } else {
          favouriteSong = await FavouriteSong.create({ favouriteId, songId });
        }
      }

      response.json({message: 'Трек успешно добавлен / удален из избранного'});
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.internalServer(error.message), request, response);
    }
  }
}