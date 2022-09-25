import { addZeroToStringBeginning } from './workingWithTypes';

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

  static calcQueueDuration = queue => {
    return queue.reduce((totalDuration, { duration }) => {
      return totalDuration + duration;
    }, 0);
  }

  static makeSingerNames(singers) {
    if (Array.isArray(singers)) {
      return singers.map(({ name }) => name).join(', ');
    } else {
      return Object.entries(singers).map(([index, { name }]) => name).join(', ');
    }
  }

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
}