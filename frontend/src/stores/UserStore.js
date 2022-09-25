import { makeAutoObservable } from "mobx";
import { stringToBoolean } from './../shared/workingWithTypes';
import { CookieAPI } from './../shared/CookieAPI';

class UserStore {
  token = CookieAPI.get('token');
  userId = parseInt(CookieAPI.get('userId'));
  login = CookieAPI.get('login');
  email = CookieAPI.get('email');
  role = CookieAPI.get('role');
  imageFileName = CookieAPI.get('imageFileName');
  isAuth = stringToBoolean(CookieAPI.get('isAuth'));

  constructor() {
    makeAutoObservable(this);
  }

  set(key, value) {
    this[key] = value;
  }
}

export const userStore = new UserStore();