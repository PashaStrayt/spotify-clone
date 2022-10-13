import { makeAutoObservable, runInAction } from "mobx";
import { stringToBoolean } from './../shared/workingWithTypes';

class UIStore {
  isLoading = false;
  isLoading2 = false;
  editSongPopup = {};
  isVisibleAudioInfoPlate = stringToBoolean(localStorage.getItem('isVisibleAudioInfoPlate')) || false;
  currentEditingSong = {};
  whichButtonIconActive = '';
  userMessage = '';
  errorMessage = '';
  stringLimit = {};
  searchQuery = '';

  constructor() {
    this.setEditSongPopup({ isVisible: false, isPreview: true });
    this.setDefaultCurrentEditingSong();
    this.setStringLimit({ name: 7, singers: 7, album: 8 });
    makeAutoObservable(this);
  }

  set(state, value) {
    state = value;
  }

  setIsLoading2(isLoading) {
    this.isLoading2 = isLoading;
  }

  setSearchQuery(query) {
    this.searchQuery = query;
  }

  setUserMessage(message) {
    this.userMessage = message;
  }
  setErrorMessage(message) {
    this.errorMessage = message;
  }

  setStringLimit({ name, singers, album }) {
    this.stringLimit = { name, singers, album };
  }

  setEditSongPopup({ isVisible, isPreview }) {
    this.editSongPopup = { isVisible, isPreview };
  }

  changeIsLoading() {
    runInAction(() => {
      this.isLoading = !this.isLoading;
    });
  }
  changeIsVisibleAudioInfoPlate() {
    runInAction(() => {
      this.isVisibleAudioInfoPlate = !this.isVisibleAudioInfoPlate;
      localStorage.setItem('isVisibleAudioInfoPlate', this.isVisibleAudioInfoPlate);
    });
  }

  setButtonIconActive(buttonName) {
    this.whichButtonIconActive = buttonName;
  }

  setCurrentEditingSong(songData) {
    this.currentEditingSong = {
      ...this.currentEditingSong,
      ...songData
    };
  }

  setSingerByIndex(index, { id, name }) {
    const singers = this.currentEditingSong.singers;
    this.currentEditingSong = {
      ...this.currentEditingSong,
      singers: {
        ...singers,
        [index]: { id, name }
      }
    };
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