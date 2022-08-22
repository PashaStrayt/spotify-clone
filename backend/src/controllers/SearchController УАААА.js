import { col, fn, Op, where } from 'sequelize';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, Playlist, PlaylistSinger, Singer, Song, SongSinger } from '../database/models.js'

const doSubstrings = string => {
  const substringsArray = string.split(' ');
  const query = substring => where(
    fn('LOWER', col('name')),
    'LIKE',
    `%${substring.toLowerCase().slice(0, -1)}%`
  );

  const first = substringsArray.map(substring => {
    return { name: query(substring) }
  });
  const second = substringsArray.map(substring => {
    return { singerName: query(substring) }
  });

  return [...first, ...second];
}

export class SearchController {
  static async search(request, response, next) {
    try {
      let { limit, page, searchMethod, searchQuery } = request.query;

      page = page || 1;
      let Model;
      switch (searchMethod) {
        case 'Albums':
          Model = Album;
          limit = limit || 6;
          break;
        case 'Playlists':
          Model = Playlist;
          limit = limit || 6;
          break;
        default:
          Model = Song;
          limit = limit || 20;
      }
      const offset = limit * page - limit;

      const searchResult = await Model.findAll({
        where: {
          [Op.or]: doSubstrings(searchQuery)
        },
        limit,
        offset
      });

      response.json(searchResult);
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  }
}