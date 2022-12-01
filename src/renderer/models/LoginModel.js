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
