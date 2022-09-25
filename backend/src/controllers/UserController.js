import { compareSync, hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, Favourite, FavouriteAlbum, FavouritePlaylist, FavouriteSong, Playlist, Song, User } from '../database/models.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { copyFile, readdir, readdirSync, unlink } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

config();

const generateJwt = (id, login, email, role, imageFileName) => {
  return jwt.sign({ id, login, email, role, imageFileName }, process.env.SECRET_KEY, { expiresIn: '24h' });
}

export class UserController {
  static async registration(request, response, next) {
    try {
      const { login, email, password } = request.body;
      const image = request?.files?.image;

      if (!login || !email || !password) {
        return next(ErrorAPI.badRequest('Не введен логин, email или пароль'));
      }
      const doUserExist = await User.findOne({ where: { email } });
      if (doUserExist) {
        return next(ErrorAPI.badRequest('Такой пользователь уже существует'));
      }

      let fileName;
      const usersDir = resolve(__dirname, '..', '..', 'static', 'users');
      if (image) {
        fileName = v4() + '.jpg';
        image.mv(resolve(usersDir, fileName));
      } else {
        fileName = 'example-user-avatar.jpg';
      }

      const hashedPassword = await hash(password, 5);
      const user = await User.create({ login, email, password: hashedPassword, imageFileName: fileName });
      await Favourite.create({ userId: user.id })
      const token = generateJwt(user.id, login, email, user.role, fileName);

      response.json({ token, userId: user.id, login, email, role: user.role, imageFileName: fileName })
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async login(request, response, next) {
    try {
      let { email, password } = request.body;
      email = email.toLowerCase();

      if (!email || !password) {
        return next(ErrorAPI.badRequest('Не введены email или пароль'));
      }
      const user = await User.findOne({ where: { email } });
      if (!user?.id) {
        return next(ErrorAPI.badRequest('Неправильный email или пароль'));
      }
      const {
        password: hashedPassword,
        id: userId,
        imageFileName,
        login,
        role
      } = user;

      const comparePasswords = compareSync(password, hashedPassword);
      if (!comparePasswords) {
        return next(ErrorAPI.badRequest('Неправильный email или пароль'));
      }

      const token = generateJwt(userId, login, email, role, imageFileName);

      response.json({ token, userId, login, email, role, imageFileName })
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async checkAuth(request, response, next) {
    try {
      const { id, login, email, role, imageFileName } = request.user;
      const token = generateJwt(id, login, email, role, imageFileName);

      return response.json({ token, userId: id, login, email, role, imageFileName });
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }

  static async updateAvatar(request, response, next) {
    try {
      const { id } = request.user;
      const { image } = request.files;
      
      const user = await User.findOne({ where: { id } });

      const dirPath = resolve(__dirname, '..', '..', 'static', 'users');
      unlink(resolve(dirPath, user.imageFileName), error => {
        if (error) throw error;
      });
      const imageFileName = v4() + '.jpg';
      image.mv(resolve(dirPath, imageFileName));

      user.imageFileName = imageFileName;
      await user.save({ fields: ['imageFileName'] });

      const token = generateJwt(user.id, user.login, user.email, user.role, user.imageFileName);

      return response.json({
        token,
        userId: user.id,
        login: user.login,
        email: user.email,
        role: user.role,
        imageFileName: user.imageFileName
      });
    } catch (error) {
      return next(ErrorAPI.internalServer(error.message));
    }
  }

  static async getFavourite(request, response, next) {
    try {
      const { id: userId, content } = request.query.id;
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
          modelId = 'songId';
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