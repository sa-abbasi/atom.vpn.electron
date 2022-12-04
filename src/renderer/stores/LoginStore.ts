import { action, computed, makeObservable, observable } from 'mobx';

/*
const LoginModel = {
  psk: 'ecb0335542a57aa241881404a9319c651545c1df',
  username: 'purevpn0s7394661',
  password: 'mpmf1eiu',

  isValid() {
    if (this.psk.length < 10) {
      return false;
    }
    if (this.username.length < 5) {
      return false;
    }
    if (this.password.length < 4) {
      return false;
    }

    return true;
  },
};

export default LoginModel;
*/

interface LoginItem {
  psk: string;
  username: string;
  password: string;
}

export class LoginStoreImpl {
  loginInfo: LoginItem = {
    psk: 'ecb0335542a57aa241881404a9319c651545c1df',
    username: 'purevpn0s7394661',
    password: 'mpmf1eiu',
  };

  constructor() {
    makeObservable(this, {
      loginInfo: observable,
      setPsk: action,
      setUserName: action,
      setPassword: action,
    });
  }

  setPsk(newPsk: string) {
    this.loginInfo.psk = newPsk;
  }

  setUserName(newValue: string) {
    this.loginInfo.username = newValue;
  }

  setPassword(newValue: string) {
    this.loginInfo.password = newValue;
  }

  get isValid() {
    if (this.loginInfo.psk.length < 10) {
      return false;
    }
    if (this.loginInfo.username.length < 5) {
      return false;
    }
    if (this.loginInfo.password.length < 4) {
      return false;
    }

    return true;
  }
}

export const LoginStore = new LoginStoreImpl();
