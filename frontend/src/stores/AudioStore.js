import { makeAutoObservable, runInAction } from "mobx";
import { deepCopy } from './../shared/workingWithTypes';

class AudioStore {
  currentPlaying = {}
  currentQueue = {}
  availableQueue = {}

  constructor() {
    this.setDefaultCurrentPlaying();
    this.setDefaultAvailableQueue();

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
  setDefaultAvailableQueue() {
    runInAction(() => {
      this.availableQueue = {
        isEnded: false,
        page: 0,
        totalPages: 1,
        queue: []
      };
    })
  }
  pushInAvailableQueue(queue) {
    this.availableQueue.queue.push(...queue);
  }
  setInAvalaibleQueueByIndex(index, song) {
    this.availableQueue.queue[index] = {...this.availableQueue.queue[index], ...song};
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
      this.setCurrentPlaying({...lastPlayed, audio: new Audio()});
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
      this.currentPlaying.audio.src = '/' + object.fileName;
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
}

export const audioStore = new AudioStore();