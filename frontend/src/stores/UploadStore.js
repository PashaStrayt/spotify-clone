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
    this.files.info = this.files.info.map((iterableInfo, iterableIndex) => {
      return iterableIndex === index ? {...iterableInfo, ...info} : iterableInfo;
    });
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