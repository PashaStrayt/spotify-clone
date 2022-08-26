import { userStore } from "../store/UserStore";

export class Auth {
  static setStateAndCookie(response) {
    if (response?.token) {
      for (let stateName in response) {
        userStore.setStateAndCookie(stateName, response[stateName]);
      }
      userStore.setStateAndCookie('isAuth', true);
      return;
    }
    userStore.setStateAndCookie('isAuth', false);
    console.log('Backend error: ' + response.message);
  }

  static async checkAuth() {
    let response = await fetch(
      '/api/user/check-auth',
      {
        headers: {
          Authorization: 'bearer ' + userStore.token
        }
      }
    )
    response = await response.json();

    this.setStateAndCookie(response)
  };

  static validateEmail(email) {
    const rage = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return rage.test(email);
  }
}