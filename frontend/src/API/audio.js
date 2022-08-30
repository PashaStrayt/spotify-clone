import { uiStore } from "../store/UIStore";

export const makeDurationString = duration => {
  const addNullToString = string => {
    if (string.toString().length === 1) {
      return `0${string}`
    }
    return string;
  }

  duration = parseInt(duration);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return addNullToString(minutes) + ' : ' + addNullToString(seconds);
};

export const makeSongsArray = async songs => {
  return songs.map(song => {
    const singers = {};
    if (song?.isPrivate) {
      song.singersNames.forEach((singerName, index) => {
        singers[index] = { id: null, name: singerName }
      });

      return {
        ...song,
        singers,
        singersNames: null
      };
    } else {
      song.SongSinger.forEach((singer, index) => {
        singers[index] = { id: singer['song-singer'].singerId, name: singer.name }
      });

      return {
        ...song,
        albumName: song.album.name,
        albumImage: song.album.image,
        singers,
        SongSinger: null,
        album: null
      }
    }
  })
};

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