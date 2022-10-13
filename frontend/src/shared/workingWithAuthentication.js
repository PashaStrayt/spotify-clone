import { CookieAPI } from './CookieAPI';
import { RestAPI } from './workingWithFetch';
import { userStore } from './../stores/UserStore';
import { uiStore } from './../stores/UIStore';

export const updateUserStoreAndCookies = async states => {
  Object.entries(states).forEach(([key, value]) => {
    userStore.set(key, value);
    CookieAPI.set(key, value);
  });
};

export const checkAuth = async () => {
  uiStore.setIsLoading2(true);
  const response = await RestAPI.checkAuth();

  await updateUserStoreAndCookies({
    ...response,
    isAuth: response.token ? true : false
  });
};