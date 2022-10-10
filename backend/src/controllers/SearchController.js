import { col, fn, Op, where } from 'sequelize';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, FavouriteSong, Favourite, FavouriteAlbum, FavouriteSongPrivate, Singer, Song, SongPrivate, SongSinger } from '../database/models.js'

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
      const userId = request?.cookies?.userId || request?.query?.userId;
      let { limit, page, searchMethod, searchQuery } = request.query;
      page = page || 1;
      let Model, ModelSinger, modelId, includeAs;

      switch (searchMethod) {
        case 'songs':
          Model = Song;
          ModelSinger = SongSinger;
          modelId = 'songId';
          includeAs = 'SongSinger'
          limit = limit || 50;
          break;
        case 'songs-private':
          Model = SongPrivate;
          limit = limit || 50;
          break;
        case 'albums':
          Model = Album;
          ModelSinger = AlbumSinger;
          modelId = 'albumId';
          includeAs = 'singers'
          limit = limit || 50;
          break;
        default:
          return next(ErrorAPI.badRequest('Неправильно указаны поисковые метод или запрос'))
      }
      const offset = limit * page - limit;

      const searchByModelResult = await Model.findAll({
        where: {
          [Op.or]: doSubstrings(searchQuery)
        },
        include: includeAs ? [
          includeAs ?
            { model: Singer, as: includeAs, attributes: ['name'] } :
            null,
          searchMethod === 'songs' ?
            { model: Album } :
            null
        ] : null,
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
              include: includeAs ? [
                includeAs ?
                  { model: Singer, as: includeAs, attributes: ['name'] } :
                  null,
                searchMethod === 'songs' ?
                  { model: Album } :
                  null
              ] : null
            });
          }));
        }));
        searchByModelSingerResult = searchByModelSingerResult.flat(2);

        searchResult = [...searchByModelResult, ...searchByModelSingerResult];
      } else {
        searchResult = searchByModelResult;
      }

      const ids = [];
      searchResult = searchResult.filter(({ id }) => {
        const result = ids.includes(id);
        if (!result) {
          ids.push(id);
        }
        return !result;
      });

      const { id: favouriteId } = await Favourite.findOne({ where: { userId } });
      switch (searchMethod) {
        case 'songs':
          const favouriteSongs = await FavouriteSong.findAll({ where: { favouriteId } });

          if (favouriteSongs.length) {
            searchResult.forEach(song => {
              let isFavourite = false;
              for (let favouriteSong of favouriteSongs) {
                if (favouriteSong.songId === song.id) {
                  isFavourite = true;
                  break;
                }
              }
              song.dataValues.isFavourite = isFavourite;
            });
          }
          break;
        case 'songs-private':
          const favouriteSongsPrivate = await FavouriteSongPrivate.findAll({ where: { favouriteId } });

          if (favouriteSongsPrivate.length) {
            searchResult.forEach(songPrivate => {
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
          break;
        case 'albums':
          const favouriteAlbums = await FavouriteAlbum.findAll({ where: { favouriteId } });

          if (favouriteAlbums.length) {
            searchResult.forEach(album => {
              let isFavourite = false;
              for (let favouriteAlbum of favouriteAlbums) {
                if (favouriteAlbum.albumId === album.id) {
                  isFavourite = true;
                  break;
                }
              }
              album.dataValues.isFavourite = isFavourite
            });
          }
          break;
        default:
          break;
      }

      response.json(searchResult);
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  }

  static async chooseSearch(request, response, next) {
    try {
      const userId = request?.cookies?.userId || request?.query?.userId;
      let { limit, page, searchQuery } = request.query;
      page = page || 1;
      limit = limit || 50;
      console.log(searchQuery);

      if (!searchQuery) {
        return response.json();
      }

      const SongsTotalPages = Math.ceil(await Song.count() / limit);
      const SongPrivatesTotalPages = Math.ceil(await SongPrivate.count() / limit);
      response.append('Total-Pages', SongsTotalPages > SongPrivatesTotalPages ? SongsTotalPages : SongPrivatesTotalPages);

      const songs = await SearchController.hardSearchSongs({
        userId, limit, page, searchMethod: 'songs', searchQuery
      });
      const privateSongs = await SearchController.hardSearchSongs({
        userId, limit, page, searchMethod: 'songs-private', searchQuery
      });

      response.json([...songs, ...privateSongs]);
    } catch (error) {
      next(ErrorAPI.badRequest(error.message));
    }
  }

  static async hardSearchSongs({ userId, limit, page, searchMethod, searchQuery }) {
    try {
      let Model, ModelSinger, modelId, includeAs;

      switch (searchMethod) {
        case 'songs':
          Model = Song;
          ModelSinger = SongSinger;
          modelId = 'songId';
          includeAs = 'SongSinger'
          break;
        case 'songs-private':
          Model = SongPrivate;
          break;
        default:
          return next(ErrorAPI.badRequest('Неправильно указаны поисковые метод или запрос'))
      }
      const offset = limit * page - limit;

      const searchByModelResult = await Model.findAll({
        where: {
          [Op.or]: doSubstrings(searchQuery)
        },
        include: includeAs ? [
          includeAs ?
            { model: Singer, as: includeAs, attributes: ['name'] } :
            null,
          searchMethod === 'songs' ?
            { model: Album } :
            null
        ] : null,
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
              include: includeAs ? [
                includeAs ?
                  { model: Singer, as: includeAs, attributes: ['name'] } :
                  null,
                searchMethod === 'songs' ?
                  { model: Album } :
                  null
              ] : null
            });
          }));
        }));
        searchByModelSingerResult = searchByModelSingerResult.flat(2);

        searchResult = [...searchByModelResult, ...searchByModelSingerResult];
      } else {
        searchResult = searchByModelResult;
      }

      const ids = [];
      searchResult = searchResult.filter(({ id }) => {
        const result = ids.includes(id);
        if (!result) {
          ids.push(id);
        }
        return !result;
      });

      const { id: favouriteId } = await Favourite.findOne({ where: { userId } });
      switch (searchMethod) {
        case 'songs':
          const favouriteSongs = await FavouriteSong.findAll({ where: { favouriteId } });

          if (favouriteSongs.length) {
            searchResult.forEach(song => {
              let isFavourite = false;
              for (let favouriteSong of favouriteSongs) {
                if (favouriteSong.songId === song.id) {
                  isFavourite = true;
                  break;
                }
              }
              song.dataValues.isFavourite = isFavourite;
            });
          }
          break;
        case 'songs-private':
          const favouriteSongsPrivate = await FavouriteSongPrivate.findAll({ where: { favouriteId } });

          if (favouriteSongsPrivate.length) {
            searchResult.forEach(songPrivate => {
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
          break;
        default:
          break;
      }

      return searchResult;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  static async hardSearchAlbums(request, response, next) {
    try {
      const userId = request?.cookies?.userId || request?.query?.userId;
      let { limit, page, searchQuery } = request.query;
      page = page || 1;
      limit = limit || 50;
      const offset = limit * page - limit;

      const totalPages = Math.ceil(await Album.count({
        where: { [Op.or]: doSubstrings(searchQuery) }
      }) / limit);
      response.append('Total-Pages', totalPages);

      const searchByModelResult = await Album.findAll({
        where: {
          [Op.or]: doSubstrings(searchQuery)
        },
        include: { model: Singer, as: 'singers', attributes: ['name'] },
        limit,
        offset
      });

      let searchResult;
      const singers = await Singer.findAll({
        where: {
          [Op.or]: doSubstrings(searchQuery)
        },
        attributes: ['id', 'name']
      });

      let searchByModelSingerResult = await Promise.all(singers.map(async singer => {
        const songs = await AlbumSinger.findAll({
          where: { singerId: singer.id },
          attributes: ['albumId'],
          limit,
          offset
        });
        return await Promise.all(songs.map(async song => {
          return await Album.findOne({
            where: { id: song['albumId'] },
            include: { model: Singer, as: 'singers', attributes: ['name'] }
          });
        }));
      }));
      searchByModelSingerResult = searchByModelSingerResult.flat(2);

      searchResult = [...searchByModelResult, ...searchByModelSingerResult];


      const ids = [];
      searchResult = searchResult.filter(({ id }) => {
        const result = ids.includes(id);
        if (!result) {
          ids.push(id);
        }
        return !result;
      });

      await Promise.all(searchResult.map(async album => {
        const songsAmount = await Song.count({ where: { albumId: album.id } });
        album.dataValues.songsAmount = songsAmount;
      }));

      response.json(searchResult);
    } catch (error) {
      console.log(error.message);
      next(ErrorAPI.badRequest(error.message));
    }
  }
}