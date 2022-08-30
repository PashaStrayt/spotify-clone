import { makeAutoObservable, runInAction } from "mobx";
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
      fileName: ''
    }
  }
  setCurrentPlaying(object) {
    this.currentPlaying = {
      ...this.currentPlaying,
      ...object
    }
  }
  setCurrentPlayingFileName(fileName) {
    this.currentPlaying.audio.src = '/' + fileName;
    this.currentPlaying.fileName = fileName;
  }
}

export const audioStore = new AudioStore();