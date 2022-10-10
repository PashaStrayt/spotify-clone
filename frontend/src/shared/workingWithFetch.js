import { updateUserStoreAndCookies } from './workingWithAuthentication';
import { uiStore } from './../stores/UIStore';
import { userStore } from './../stores/UserStore';

export const fetching = async callback => {
  try {
    uiStore.changeIsLoading();
    await callback();
  } catch (error) {
    uiStore.setErrorMessage(error.message)
  } finally {
    uiStore.changeIsLoading();
  }
}
export const fetchingWithoutPreloader = async callback => {
  try {
    await callback();
  } catch (error) {
    uiStore.setErrorMessage(error.message)
  }
}

export class RestAPI {
  static async advancedFetch({ url, param, query, body, convertToFormData, method = 'GET' }) {
    if (param) {
      url += url.slice(-1) !== '/' ? '/' : '';
      url = url + param;
    }

    if (query) {
      query = Object.entries(query);
      if (query?.length !== 0) {
        url += '?';

        query.forEach(([property, value]) => {
          if (!value) return;
          url = url + property + '=' + value + '&';
        });

        if (url.slice(-1) === '&') {
          url = url.slice(0, -1);
        }
      }
    }

    url = encodeURI(url);

    let formData = new FormData();
    let jsonString = '';
    if (body) {
      if (Object.entries(body).length !== 0) {
        if (convertToFormData) {
          formData.append('test', 4543);
          Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value);
          });
        } else {
          jsonString = JSON.stringify(body);
        }
      }
    }

    const request = {
      method,
      headers: {
        'Authorization': 'bearer ' + userStore.token
      }
    };
    if (method !== 'GET') {
      request.body = convertToFormData ? formData : jsonString;
    }
    if (!convertToFormData) {
      request.headers['Content-Type'] = 'application/json'
    }

    let response = await fetch(url, request);

    const { status: statusCode } = response;
    const totalPages = response.headers.get('Total-Pages');
    const headers = { totalPages };

    response = await response.json();
    if (response.message) {
      switch (statusCode) {
        case 200:
          uiStore.setUserMessage(response.message);
          break;
        default:
          uiStore.setErrorMessage(response.message);
          break;
      }
    }

    return { statusCode, headers, response };
  };

  static async uploadPreviewImage(image) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/image/preview',
      body: { 0: image },
      convertToFormData: true,
      method: 'POST'
    });
    return { statusCode, headers, response };
  }

  static async searchForAdvices({ searchMethod, searchQuery }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/search/simple',
      query: { searchMethod, searchQuery }
    });

    return { statusCode, headers, response };
  }

  static async uploadSongs({ info, content }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/song',
      body: { songsInfo: JSON.stringify(info), ...content },
      convertToFormData: true,
      method: 'POST'
    });

    return { statusCode, headers, response };
  }
  static async changeSongFavourite({ isPrivate, userId, songId }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/song/change-favourite',
      query: { isPrivate, userId, songId },
      method: 'POST'
    });
    return { statusCode, headers, response };
  }
  static async updateSong({ songData }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/song/update',
      body: songData,
      method: 'POST'
    });

    return { statusCode, headers, response };
  }
  static async searchSongs({ page = 1, limit = 50, searchQuery }) {
    const { statusCode, response, headers } = await this.advancedFetch({
      url: '/api/search/hard/songs',
      query: { page, limit, searchQuery }
    });
    return { statusCode, response, headers };
  }
  static async deleteSong({ songId, isPrivate, userId }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/song',
      param: songId,
      query: { isPrivate, userId },
      method: 'DELETE'
    });
    return { statusCode, headers, response };
  }

  static async createAlbum({ name, singers, date, image }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/album',
      body: {
        name, singers: JSON.stringify(singers), date, image
      },
      convertToFormData: true,
      method: 'POST'
    });
    return { statusCode, headers, response };
  }
  static async changeAlbumFavourite({ albumId }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/album/change-favourite',
      query: { albumId },
      method: 'POST'
    });
    return { statusCode, headers, response };
  }
  static async updateAlbum({ id, name, date, singers }) {
    const { statusCode, response } = await this.advancedFetch({
      url: '/api/album/edit',
      body: { id, name, date, singers: JSON.stringify(singers) },
      convertToFormData: true,
      method: 'POST'
    });
    return { statusCode, response };
  }
  static async getAlbum({ id }) {
    const isAuth = userStore.isAuth;
    const userId = userStore.userId;
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/album',
      param: id,
      query: isAuth ? { userId } : null
    });
    return { statusCode, headers, response };
  }
  static async getAllAlbums({ page, limit }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/album',
      query: { page, limit }
    });
    return { statusCode, headers, response };
  }
  static async getFavouriteAlbums({ page = 1, limit = 50 }) {
    const { statusCode, response, headers } = await this.advancedFetch({
      url: '/api/album/favourite',
      query: { page, limit }
    });
    return { statusCode, response, headers };
  }
  static async searchAlbums({ page = 1, limit = 50, searchQuery }) {
    const { statusCode, response, headers } = await this.advancedFetch({
      url: '/api/search/hard/albums',
      query: { page, limit, searchQuery }
    });
    return { statusCode, response, headers };
  }
  static async updateAlbumImage({ id, image }) {
    const { statusCode, response } = await this.advancedFetch({
      url: '/api/album/update-image',
      body: { id, image },
      convertToFormData: true,
      method: 'POST'
    });
    const imageFileName = response?.imageFileName;
    return { statusCode, imageFileName };
  }
  static async deleteAlbum({ id }) {
    const { statusCode, response } = await this.advancedFetch({
      url: '/api/album',
      param: id,
      method: 'DELETE'
    });
    return { statusCode, response };
  }

  static async createPlaylist({ name, image }) {
    return await this.advancedFetch({
      url: '/api/playlist',
      body: {
        name, image
      },
      convertToFormData: true,
      method: 'POST'
    });
  }
  static async changePlaylistFavourite({ playlistId }) {
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/playlist/change-favourite',
      query: { playlistId },
      method: 'POST'
    });
    return { statusCode, headers, response };
  }
  static async getPlaylist({ id }) {
    const isAuth = userStore.isAuth;
    const userId = userStore.userId;
    const { statusCode, headers, response } = await this.advancedFetch({
      url: '/api/album',
      param: id,
      query: isAuth ? { userId } : null
    });
    return { statusCode, headers, response };
  }

  static async createSinger({ name, image }) {
    return await this.advancedFetch({
      url: '/api/singer',
      body: {
        name, image
      },
      convertToFormData: true,
      method: 'POST'
    });
  }

  static async register({ login, email, password, avatar }) {
    return await this.advancedFetch({
      url: '/api/user/registration',
      body: {
        login, email, password, image: avatar.file
      },
      convertToFormData: true,
      method: 'POST'
    });
  }
  static async login({ email, password }) {
    return await this.advancedFetch({
      url: '/api/user/login',
      body: { email, password },
      method: 'POST'
    });
  }
  static async checkAuth() {
    const { response } = await this.advancedFetch({
      url: '/api/user/check-auth'
    });
    return response;
  }
  static async uploadAvatar(image) {
    const { response } = await this.advancedFetch({
      url: '/api/user/update-avatar',
      body: { image },
      convertToFormData: true,
      method: 'POST'
    });

    updateUserStoreAndCookies({
      ...response,
      isAuth: response.token ? true : false
    });

    return response.imageFileName;
  }
}