import { compareSync, hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, Favourite, FavouriteAlbum, FavouritePlaylist, FavouriteSong, Playlist, Song, User } from '../database/models.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

config();

const generateJwt = (id, login, email, role, image) => {
  return jwt.sign({ id, login, email, role, image }, process.env.SECRET_KEY, { expiresIn: '24h' });
}

export class UserController {
  static async registration(request, response, next) {
    try {
      const { login, email, password, role } = request.body;
      const { image } = request.files;

      if (!login || !email || !password) {
        return next(ErrorAPI.badRequest('Не введен логин, email или пароль'));
      }
      const doUserExist = await User.findOne({ where: { email } });
      if (doUserExist) {
        return next(ErrorAPI.internalServer('Такой пользователь уже существует'));
      }

      const fileName = v4() + '.jpg';
      image.mv(resolve(__dirname, '..', '..', 'static', 'users', fileName));

      const hashedPassword = await hash(password, 5);
      const user = await User.create({ login, email, password: hashedPassword, role, image: fileName });
      const token = generateJwt(user.id, login, email, role, fileName);

      response.json({ token, userId: user.id, login, email, role, image: fileName })
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async login(request, response, next) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return next(ErrorAPI.badRequest('Не введен логин, email или пароль'));
      }
      const {
        password: hashedPassword,
        id: userId,
        image,
        login,
        role
      } = await User.findOne({ where: { email } });
      if (!userId) {
        return next(ErrorAPI.internalServer('Неправильный логин или пароль'));
      }

      const comparePasswords = compareSync(password, hashedPassword);
      if (!comparePasswords) {
        return next(ErrorAPI.internalServer('Неправильный логин или пароль'));
      }

      const token = generateJwt(userId, login, email, role, image);

      response.json({ token, userId, login, email, role, image })
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async checkAuth(request, response, next) {
    try {
      const { id, login, email, role, image } = request.user;
      const token = generateJwt(id, login, email, role, image);

      return response.json({ token, userId: id, login, email, role, image });
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getFavourite(request, response, next) {
    try {
      const {id: userId, content} = request.query.id;
      let FavouriteModel, Model, modelId;
      switch (content) {
        case 'albums':
          FavouriteModel = FavouriteAlbum;
          Model = Album;
          modelId = 'albumId';
          break;
        case 'playlists':
          FavouriteModel = FavouritePlaylist;
          Model = Playlist;
          modelId = 'playlistId';
          break;
        default:
          FavouriteModel = FavouriteSong;
          Model = Song;
          modelId =  'songId';
          break;
      }

      const { id: favouriteId } = await Favourite.findOne({ where: { userId } });
      const favouriteModels = await FavouriteModel.findAll({
        where: { favouriteId }
      });
      const models = await Promise.all(favouriteModels.map(async model => {
        return await Model.findOne({ where: { id: model[modelId] } })
      }));

      return response.json(models);
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }
}