import { makeAutoObservable, runInAction } from "mobx";
import { makeSingerNames } from "../API/audio";
import { deepCopy } from "../API/files";

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
      singers: '',
      albumName: '',
      fileName: '',
      albumImage: '',
      format: '',
      isFavourite: false,
      currentTime: 0,
      isEnded: false,
      volume: 0.5,
      index: 0
    };
    this.currentPlaying.audio.volume = 0.5;
    const lastPlayed = JSON.parse(localStorage.getItem('lastPlayed'));
    if (lastPlayed) {
      this.setCurrentPlaying({...lastPlayed, audio: new Audio()});
      this.currentPlaying.audio.currentTime = Number(lastPlayed.currentTime);
      this.currentPlaying.audio.volume = Number(lastPlayed.volume);
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
      singers: makeSingerNames(singers),
      albumName,
      fileName,
      duration,
      isFavourite,
      index: index
    });
  }
}

export const audioStore = new AudioStore();