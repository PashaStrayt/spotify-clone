import { makeAutoObservable } from "mobx";

class UIStore {
  isLoading = false;
  currentEditingSong = {};
  whichButtonIconActive = '';

  constructor() {
    this.setDefaultCurrentEditingSong();
    makeAutoObservable(this);
  }

  changeIsLoading = () => {
    this.isLoading = !this.isLoading;
  }

  setButtonIconActive(buttonName) {
    this.whichButtonIconActive = buttonName;
  }

  setCurrentEditingSong(song) {
    this.currentEditingSong = song;
  }

  setDefaultCurrentEditingSong() {
    this.currentEditingSong = {
      name: '',
      singerName: '',
      albumName: '',
      singerId: null,
      albumId: null,
      index: null
    };
  }
}

export const uiStore = new UIStore();