import { config } from 'dotenv';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Song, SongPlaylist, SongPrivate, SongPrivatePlaylist, SongSinger, User } from '../database/models.js';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 } from 'uuid';
import e from 'express';

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
          singerId,
          singerName,
          albumName,
          format
        } = songsInfo[index];

        const fileName = v4() + '.' + format;
        song[1].mv(resolve(__dirname, '..', '..', 'static', 'songs', fileName));

        const path = `http://localhost:${process.env.PORT}/${fileName}`;
        let duration = await getAudioDurationInSeconds(path);
        duration = Math.floor(duration);

        if (albumId && singerId) {
          const song = await Song.create({
            name, albumId, format, duration, fileName
          });
          await SongSinger.create({
            songId: song.id, singerId
          });
        } else {
          await SongPrivate.create({
            name, singerName, albumName, format, duration, fileName
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
}