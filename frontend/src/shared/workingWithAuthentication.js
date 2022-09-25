import { CookieAPI } from './CookieAPI';
import { RestAPI } from './workingWithFetch';
import { userStore } from './../stores/UserStore';

export const updateUserStoreAndCookies = async states => {
  Object.entries(states).forEach(([key, value]) => {
    userStore.set(key, value);
    CookieAPI.set(key, value);
  });
};

export const checkAuth = async () => {
  const response = await RestAPI.checkAuth();

  await updateUserStoreAndCookies({
    ...response,
    isAuth: response.token ? true : false
  });
};