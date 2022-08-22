import { makeAutoObservable } from "mobx";
import { getCookie, setCookie } from "../API/cookies";

class UserStore {
  token = '1';
  userId = parseInt(getCookie('userId'));
  login = getCookie('login');
  email = getCookie('email');
  role = getCookie('role');
  image = getCookie('image');
  isAuth = getCookie('isAuth');

  constructor() {
    makeAutoObservable(this);
  }

  setStateFromCookie(stateName) {
    this[stateName] = getCookie(stateName);
  }

  setStateAndCookie(stateName, value, options) {
    setCookie(stateName, value, options);
    this.setStateFromCookie(stateName);
  }
}

export const userStore = new UserStore();