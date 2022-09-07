import { makeAutoObservable, runInAction } from "mobx";

class UIStore {
  isLoading = false;
  isVisibleSongInfoPlate = localStorage.getItem('isVisibleSongInfoPlate') || 'false';
  currentEditingSong = {};
  whichButtonIconActive = '';
  errorMessage = '';

  constructor() {
    this.setDefaultCurrentEditingSong();
    makeAutoObservable(this);
  }

  setErrorMessage(message = '') {
    this.errorMessage = message;
  }

  changeIsLoading() {
    runInAction(() => {
      this.isLoading = !this.isLoading;
    });
  }
  changeIsVisibleSongInfoPlate() {
    runInAction(() => {
      this.isVisibleSongInfoPlate = this.isVisibleSongInfoPlate === 'true' ? 'false' : 'true';
      localStorage.setItem('isVisibleSongInfoPlate', this.isVisibleSongInfoPlate);
    });
  }

  setButtonIconActive(buttonName) {
    this.whichButtonIconActive = buttonName;
  }

  setCurrentEditingSong(song) {
    this.currentEditingSong = song;
  }

  setSingerIdAndNameByIndex(index, { id, name }) {
    this.currentEditingSong.singers[index] = { id, name };
  }

  setDefaultCurrentEditingSong() {
    this.currentEditingSong = {
      name: '',
      singers: { 0: { id: null, name: '' } },
      albumName: '',
      albumId: null,
      index: null
    };
  }
}

export const uiStore = new UIStore();