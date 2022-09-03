import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import { deepCopy } from "../API/files";

class AudioStore {
  currentPlaying = {}
  currentQueue = {}
  availableQueue = {}

  constructor() {
    this.setDefaultCurrentPlaying();
    this.setDefaultAvailableQueue();
    this.currentQueue = deepCopy(this.availableQueue);
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
        page: 1,
        queue: []
      };
    })
  }

  setCurrentQueue(object) {
    this.currentQueue = object;
  }

  setDefaultCurrentPlaying() {
    this.currentPlaying = {
      audio: new Audio(),
      name: '',
      singers: '',
      albumName: '',
      fileName: '',
      isFavourite: false,
      currentTime: 0
    };
  }
  setCurrentPlaying(object) {
    this.currentPlaying = {
      ...this.currentPlaying,
      ...object
    };
    if (object.fileName) {
      this.currentPlaying.audio.src = '/' + object.fileName;
      localStorage.setItem('lastPlayed', JSON.stringify(object));
    }
  }
}

export const audioStore = new AudioStore();