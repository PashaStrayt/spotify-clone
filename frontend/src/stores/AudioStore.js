import { makeAutoObservable, runInAction } from "mobx";
import { deepCopy } from './../shared/workingWithTypes';
import { PROXY_URL } from './../shared/workingWithFetch';

class AudioStore {
  currentPlaying = {};
  currentQueue = {};
  availableQueue = {};
  albums = {};

  constructor() {
    this.setDefaultCurrentPlaying();
    this.setDefaultAvailableQueue({ page: -1 });
    this.setDefaultAlbums({ page: -1 });

    const lastQueue = JSON.parse(localStorage.getItem('lastQueue'));
    if (lastQueue?.page) {
      this.currentQueue = lastQueue;
    } else {
      this.currentQueue = deepCopy(this.availableQueue);
    }

    makeAutoObservable(this);
  }

  setAvailableQueue(queue) {
    runInAction(() => {
      this.availableQueue = {
        ...this.availableQueue,
        ...queue
      };
    });
  }
  setDefaultAvailableQueue(album) {
    runInAction(() => {
      this.availableQueue = {
        isEnded: false,
        page: album?.page || 0,
        totalPages: 1,
        queue: []
      };
    })
  }
  pushInAvailableQueue(queue) {
    this.availableQueue.queue.push(...queue);
  }
  setInAvalaibleQueueByIndex(index, song) {
    this.availableQueue.queue[index] = { ...this.availableQueue.queue[index], ...song };
  }
  deleteFromAvailableQueue(indexDeletion) {
    this.availableQueue.queue = this.availableQueue.queue.filter((song, index) => {
      return index !== indexDeletion;
    });
  }

  setCurrentQueue(object) {
    this.currentQueue = {
      ...this.currentQueue,
      ...object
    };
  }
  pushInCurrentQueue(queue) {
    this.currentQueue.queue.push(...queue);
  }

  setDefaultCurrentPlaying() {
    this.currentPlaying = {
      audio: new Audio(),
      name: '',
      singers: {},
      albumName: '',
      fileName: '',
      albumImage: '',
      format: '',
      isFavourite: false,
      currentTime: 0,
      isEnded: false,
      index: 0
    };
    const lastPlayed = JSON.parse(localStorage.getItem('lastPlayed'));
    if (lastPlayed) {
      this.setCurrentPlaying({ ...lastPlayed, audio: new Audio() });
      this.currentPlaying.audio.currentTime = Number(lastPlayed.currentTime);
      this.currentPlaying.audio.volume = Number(lastPlayed.volume);
    } else {
      this.currentPlaying.audio.volume = 0.5;
    }
  }
  setCurrentPlaying(object) {
    this.currentPlaying = {
      ...this.currentPlaying,
      ...object
    };
    if (object.fileName) {
      this.currentPlaying.audio.src = PROXY_URL + '/' + object.fileName;
    }
  }
  setNextCurrentPlaying(index) {
    const nextSong = this.currentQueue.queue[index];
    const { name, singers, albumName, fileName, duration, isFavourite } = nextSong;

    this.setCurrentPlaying({
      name,
      singers,
      albumName,
      fileName,
      duration,
      isFavourite,
      index: index
    });
  }

  changeSong({ id, name, singers, albumName, albumImage, isFavourite }) {
    this.availableQueue.queue = this.availableQueue.queue.map((song) => {
      if (song.id === id) {
        return {
          ...song,
          name: name ? name : song.name,
          singers: singers ? singers : song.singers,
          albumName: albumName ? albumName : song.albumName,
          albumImage: albumImage ? albumImage : song.albumImage,
          isFavourite: isFavourite !== null ? isFavourite : song.isFavourite,
        };
      }
      return song;
    });

    this.currentQueue.queue = this.currentQueue.queue.map((song) => {
      if (song.id === id) {
        return {
          ...song,
          name: name ? name : song.name,
          singers: singers ? singers : song.singers,
          albumName: albumName ? albumName : song.albumName,
          albumImage: albumImage ? albumImage : song.albumImage,
          isFavourite: isFavourite !== null ? isFavourite : song.isFavourite,
        };
      }
      return song;
    });

    const song = this.currentPlaying;
    if (song.id === id) {
      this.currentPlaying = {
        ...song,
        name: name ? name : song.name,
        singers: singers ? singers : song.singers,
        albumName: albumName ? albumName : song.albumName,
        albumImage: albumImage ? albumImage : song.albumImage,
        isFavourite: isFavourite !== null ? isFavourite : song.isFavourite,
      };
    }
  }
  changeAlbum({ name, id, image }) {
    this.availableQueue.queue = this.availableQueue.queue.map((song) => {
      return {
        ...song,
        albumName: name ? name : song.albumName,
        albumImage: image && song.albumId === id ? image : song.albumImage
      };
    });

    this.currentQueue.queue = this.currentQueue.queue.map((song) => {
      return {
        ...song,
        albumName: name && song.albumId === id ? name : song.albumName,
        albumImage: image && song.albumId === id ? image : song.albumImage
      };
    });

    const currentPlaying = this.currentPlaying;
    if (currentPlaying.albumId === id) {
      if (name) {
        currentPlaying.albumName = name;
      }
      if (image) {
        currentPlaying.albumImage = image;
      }
    }
  }

  setDefaultAlbums(album) {
    runInAction(() => {
      this.albums = {
        page: album?.page || 0,
        totalPages: 1,
        list: []
      }
    });
  }
  setAlbums(albums) {
    runInAction(() => {
      this.albums = {
        ...this.albums,
        ...albums
      };
    });
  }
  pushInAlbumsList(list) {
    this.albums.list.push(...list);
  }
}

export const audioStore = new AudioStore();