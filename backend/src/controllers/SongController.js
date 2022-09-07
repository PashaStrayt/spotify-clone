import { config } from 'dotenv';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, Favourite, FavouriteSong, FavouriteSongPrivate, Singer, Song, SongPlaylist, SongPrivate, SongPrivatePlaylist, SongSinger, User } from '../database/models.js';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 } from 'uuid';

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
          if (!value.id) {
            hasOnlyExistingSingers = false;
          }
          singersIds.push(value.id);
          singersNames.push(value.name);
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
          await SongPrivate.create({
            name, singersNames, albumName, format, duration, fileName
          });
        }
      });

      return response.json({ message: 'SUCCESS' });
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

  static async deleteSongById(request, response, next) {
    try {
      const { id } = request.params;
      const { isPrivate } = request.query;

      if (isPrivate) {
        await SongPrivate.destroy({ where: { id } });
      } else {
        await Song.destroy({ where: { id } });
      }

      return response.json({ message: 'SUCCESS' });
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async update(request, response, next) {
    try {
      const {
        id,
        name,
        singerName,
        albumName,
        singerId,
        albumId,
        wasPrivate
      } = request.body;

      let song;
      if (wasPrivate) {
        if (singerId && albumId) {
          const { format, duration, fileName } = await SongPrivate.findOne(
            { where: { id } }
          );
          await SongPrivate.destroy({ where: { id } })

          song = await Song.create({
            name, albumId, format, duration, fileName
          });
          await SongSinger.create({
            songId: song.id, singerId
          });
        } else {
          song = await SongPrivate.findOne({ where: { id } });

          song.name = name;
          song.singerName = singerName;
          song.albumName = albumName;

          await song.save({ fields: ['name', 'singerName', 'albumName'] });
        }
      } else {
        if (singerId && albumId) {
          const songSinger = await SongSinger.findOne({
            where: { songId: id }
          });
          songSinger.singerId = singerId;
          await songSinger.save({ fields: ['singerId'] });

          song = await Song.findOne({ where: { id } });
          song.name = name;
          song.albumId = albumId;
          await song.save({ fields: ['name', 'albumId'] });
        } else {
          await SongSinger.destroy({ where: { songId: id } });

          const { format, duration, fileName } = await Song.findOne({ where: { id } });

          await Song.destroy({ where: { id } });

          song = await SongPrivate.create({
            name, singerName, albumName, format, duration, fileName
          });
        }
      }

      return response.json(song);
    } catch (error) {
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
        if(favouriteSongsPrivate.length) {
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
}