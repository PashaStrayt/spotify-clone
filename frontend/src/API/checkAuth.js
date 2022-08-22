import { userStore } from "../store/UserStore";

export const checkAuth = async () => {
  let response = await fetch(
    '/api/user/check-auth',
    { 
      headers: {
        Authorization: 'bearer ' + userStore.token
      }
    }
  )
  response = await response.json();

  if (response?.token) {
    for (let stateName in response) {
      userStore.setStateAndCookie(stateName, response[stateName]);
      userStore.setStateAndCookie('isAuth', true);
    }
    return;
  }
  userStore.setStateAndCookie('isAuth', false);
  console.log('Backend error: ' + response.message);
};