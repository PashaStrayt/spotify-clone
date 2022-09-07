import { col, fn, Op, where } from 'sequelize';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, Playlist, Singer, Song, SongPrivate, SongSinger } from '../database/models.js'

const doSubstrings = string => {
  const substringsArray = string.split(' ');

  return substringsArray.map(substring => {
    substring.length <= 2 ?
      substring = substring.toLowerCase() :
      substring = substring.toLowerCase().slice(0, -1);

    return {
      name: where(
        fn('LOWER', col('name')),
        'LIKE',
        `%${substring}%`
      )
    }
  });
}

export class SearchController {
  static async simpleSearch(request, response, next) {
    try {
      let { searchMethod, searchQuery } = request.query;
      const limit = 5;
      let Model;

      if (!searchMethod || !searchQuery) {
        return next(ErrorAPI.badRequest('Не указан запрос или метод'));
      }

      switch (searchMethod) {
        case 'singer':
          Model = Singer;
          break;
        case 'album':
          Model = Album;
          break;
        default:
      }

      const result = await Model.findAll({
        where: {
          [Op.or]: doSubstrings(searchQuery)
        },
        limit
      });

      response.json(result);
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  }

  static async hardSearch(request, response, next) {
    try {
      let { limit, page, searchMethod, searchQuery } = request.query;
      page = page || 1;
      let Model, ModelSinger, modelId, includeAs;

      switch (searchMethod) {
        case 'songs':
          Model = Song;
          ModelSinger = SongSinger;
          modelId = 'songId';
          includeAs = 'SongSinger'
          limit = limit || 20;
          break;
        case 'songs-private':
          Model = SongPrivate;
          limit = limit || 20;
          break;
        case 'albums':
          Model = Album;
          ModelSinger = AlbumSinger;
          modelId = 'albumId';
          includeAs = 'AlbumSinger'
          limit = limit || 6;
          break;
        case 'playlists':
          Model = Playlist;
          limit = limit || 6;
          break;
        default:
          return next(ErrorAPI.badRequest('Неправильно указаны поисковые метод или запрос'))
      }
      const offset = limit * page - limit;

      const searchByModelResult = await Model.findAll({
        where: {
          [Op.or]: doSubstrings(searchQuery)
        },
        include: includeAs ? { model: Singer, as: includeAs, attributes: ['name'] } : null,
        limit,
        offset
      });

      let searchResult;
      if (ModelSinger) {
        const singers = await Singer.findAll({
          where: {
            [Op.or]: doSubstrings(searchQuery)
          },
          attributes: ['id', 'name']
        });

        let searchByModelSingerResult = await Promise.all(singers.map(async singer => {
          const songs = await ModelSinger.findAll({
            where: { singerId: singer.id },
            attributes: [modelId],
            limit,
            offset
          });
          return await Promise.all(songs.map(async song => {
            return await Model.findOne({
              where: { id: song[modelId] },
              include: includeAs ? { model: Singer, as: includeAs, attributes: ['name'] } : null
            });
          }));
        }));
        searchByModelSingerResult = searchByModelSingerResult.flat(2);

        searchResult = [...searchByModelResult, ...searchByModelSingerResult];
      } else {
        searchResult = searchByModelResult;
      }

      response.json(searchResult);
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  }
}