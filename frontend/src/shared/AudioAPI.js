import { uiStore } from '../stores/UIStore';
import { addZeroToStringBeginning } from './workingWithTypes';
import isObject from 'isobject';

export class AudioAPI {
  static formatTime(duration, { makeIndent = false, withHours = false }) {

    duration = parseInt(duration);
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    let result = [minutes, seconds];
    if (withHours) {
      result.unshift(hours);
    }
    result = result.map(item => addZeroToStringBeginning(item));

    return result.join(makeIndent ? ' : ' : ':');
  }

  static makeSingerNames(singers) {
    if (!singers) return '';
    if (Array.isArray(singers)) {
      return singers.map(({ name }) => name).join(', ');
    } else {
      return Object.entries(singers).map(([index, { name }]) => name).join(', ');
    }
  }

  static makeSingersArray(singers) {
    if (isObject(singers)) {
      return Object.entries(singers).map(([, singer]) => singer);
    } else if (Array.isArray(singers)) {
      return singers;
    }
  };
  static makeSingersObject(singers) {
    if (Array.isArray(singers)) {
      const result = {};
      singers.forEach((singer, index) => {
        result[index] = singer;
      });
      return result;
    } else if (isObject(singers)) {
      return singers;
    }
  };

  static makeValidExtension(name) {
    if (name.toLowerCase().includes('flac')) {
      return 'flac';
    }
    return name.slice(-3);
  }

  static makeSongsArray(songs) {
    return songs.map(song => {
      const singers = {};
      if (song?.isPrivate) {
        song.singersNames.forEach((singerName, index) => {
          singers[index] = { id: null, name: singerName }
        });

        return {
          ...song,
          singers,
          albumImage: 'album-image.svg',
          singersNames: null
        };
      } else {
        song.SongSinger.forEach((singer, index) => {
          singers[index] = { id: singer['song-singer'].singerId, name: singer.name }
        });

        return {
          ...song,
          albumName: song.album.name,
          albumImage: song.album.imageFileName || 'album-image.svg',
          singers,
          SongSinger: null,
          album: null
        }
      }
    })
  }

  static isItAcceptedExtension(extension) {
    const acceptExtensions = [
      'audio/flac',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg'
    ];

    return acceptExtensions.includes(extension);
  }

  static isAlbumFormValid({ name, singers, date }) {
    if (!name) {
      uiStore.setErrorMessage('Название не может быть пустым');
      return false;
    }
    if (!date || date.length !== 4 || !/^\d+$/.test(date)) {
      uiStore.setErrorMessage('Введите корректный год выпуска в формате "xxxx"');
      return false;
    }
    let sortSingers = [];
    for (let { id, name } of this.makeSingersArray(singers)) {
      if (id && name) {
        sortSingers.push({ id, name });
      }
      if ((!id && name) || (id && !name)) {
        uiStore.setErrorMessage('Все исполнители должны быть выбраны с помощью подсказок');
        return false;
      }
    }
    if (!sortSingers.length) {
      uiStore.setErrorMessage('Укажите хотя бы одного исполнителя');
      return false;
    }

    return true;
  };
}