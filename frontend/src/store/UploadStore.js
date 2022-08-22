import { makeAutoObservable } from "mobx";

class UploadStore {
  files = {};

  constructor() {
    this.setDefaultFiles()
    makeAutoObservable(this);
  }

  setDefaultFiles() {
    this.files = {
      info: [],
      content: []
    };
  }

  setFileInfo(info, index) {
    this.files.info[index] = {...this.files.info[index], ...info};
  }

  deleteFile(staticIndex) {
    const filterCallback = (file, iterableIndex) => iterableIndex !== staticIndex;
    const info = this.files.info.filter(filterCallback);
    const content = this.files.content.filter(filterCallback);
    this.files = { info, content };
  }

  pushFiles(info, content) {
    this.files.info.push(info);
    this.files.content.push(content);
  }
}

export const uploadStore = new UploadStore();