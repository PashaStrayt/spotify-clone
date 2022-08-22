import { hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { ErrorAPI } from '../API/ErrorAPI.js';
import { Album, AlbumSinger, Singer, Song, SongSinger, User } from '../database/models.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rm } from 'fs/promises';

export class SingerController {
  static async create(request, response, next) {
    try {
      const { name } = request.body;

      const singer = await Singer.create({ name });

      return response.json(singer);
    } catch (error) {
      next(ErrorAPI.internalServer(error.message));
    }
  }
}