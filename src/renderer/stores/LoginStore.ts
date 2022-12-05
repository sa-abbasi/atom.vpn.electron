import { action, computed, makeObservable, observable } from 'mobx';

interface LoginItem {
  psk: string;
  username: string;
  password: string;
}

export class LoginStoreImpl {
  loginInfo: LoginItem = {
    psk: '',
    username: '',
    password: '',
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
