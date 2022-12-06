/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

// import { useNavigate } from 'react-router-dom';

import { CommsFacade } from '../CommsFacade';

const LoginComponent = observer(
  ({ loginStore, messageStore, loginCompleteCallBack }) => {
    // const navigate = useNavigate();

    const [nameError, setnameError] = useState('');
    const [passwordError, setpasswordError] = useState('');
    const [pskError, setpskError] = useState('');
    const showUserName = true;

    const { loginInfo } = loginStore;

    const commsFacade = CommsFacade;

    const handleFieldInputChange = (e) => {
      const { name, value } = e.target;
      loginStore.loginInfo[name] = value;
    };

    const validatePassword = () => {
      const { password } = loginInfo;
      if (!password) {
        setpasswordError('Password is required');
        return;
      }

      if (password.length < 4) {
        setpasswordError('Password must be at least 4 characters');
        return;
      }

      setpasswordError('');
    };

    const validatePSK = () => {
      if (!loginInfo.psk) {
        setpskError('PSK is required');
        return;
      }

      if (loginInfo.psk.length < 10) {
        setpskError('PSK must be greater than 10 characters');
        return;
      }

      setpskError('');
    };

    const validateUserName = () => {
      const userName = loginInfo.username;

      if (!userName) {
        setnameError('User name is required');
        return;
      }

      if (userName.length < 4) {
        setnameError('User name must be at least 4 characters');
        return;
      }

      setnameError('');
    };

    const validateInput = () => {
      validatePSK();
      validateUserName();
      validatePassword();
    };

    const renderErrorMessage = (name) => {
      if (name === 'psk') {
        if (pskError) {
          return <div className="error text-warning">{pskError}</div>;
        }

        return <></>;
      }

      if (name === 'username') {
        if (nameError) {
          return <div className="error text-warning">{nameError}</div>;
        }
        return <></>;
      }

      if (name === 'password') {
        if (passwordError) {
          return <div className="error text-warning">{passwordError}</div>;
        }
        return <></>;
      }

      return <></>;
    };

    useEffect(() => {
      validateInput();
    }, []);

    const handleConnectClick = (e) => {
      messageStore.addInfo('LoginComp.handleConnectClick called');

      validateInput();

      if (!loginStore.isValid) {
        return;
      }

      messageStore.addInfo('Connecting with SDK');

      commsFacade
        .Connect(loginStore.loginInfo)
        .then((result) => {
          const msg = `CommsFacade.Connect result received from commsFacade ${JSON.stringify(
            result
          )}`;

          messageStore.addInfo(msg);

          // eslint-disable-next-line promise/always-return
          if (result.IsOK) {
            loginCompleteCallBack();
          } else {
            // eslint-disable-next-line no-alert
            alert(result.Message);
          }
        })
        .catch((error) => {
          console.log(`CommsFacade.Connect error ${error}`);
        });
    };

    return (
      <div className="Center-Item">
        <div
          className="Card bg-secondary p-4 rounded-3"
          style={{ minWidth: '400px' }}
        >
          {/* <div className="card-header my-3">
          <h4 className="card-title text-center"> Enter Credendentials</h4>
        </div> */}
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="psk">Preshared Security Key:</label>
              <input
                type="text"
                name="psk"
                value={loginStore.loginInfo.psk}
                className="form-control"
                placeholder="Enter PSK"
                id="psk"
                minLength={10}
                maxLength={50}
                required
                onChange={(event) => {
                  loginStore.setPsk(event.target.value);
                  validateInput();
                }}
              />
              {renderErrorMessage('psk')}
            </div>

            {showUserName && (
              <div className="form-group mt-2">
                <label htmlFor="username">User Name:</label>
                <input
                  type="text"
                  name="username"
                  value={loginStore.loginInfo.username}
                  className="form-control"
                  placeholder="Enter User Name"
                  id="username"
                  minLength={4}
                  maxLength={30}
                  required
                  onChange={(event) => {
                    loginStore.setUserName(event.target.value);
                    validateInput();
                  }}
                />
                {renderErrorMessage('username')}
              </div>
            )}
            {showUserName && (
              <div className="form-group mt-2">
                <label htmlFor="password">Password:</label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  value={loginStore.loginInfo.password}
                  className="form-control"
                  placeholder="Enter Password"
                  minLength={4}
                  maxLength={30}
                  required
                  onChange={(event) => {
                    loginStore.setPassword(event.target.value);
                    validateInput();
                  }}
                />
                {renderErrorMessage('password')}
              </div>
            )}
            <div className="form-group mt-4 text-center ">
              <button
                type="button"
                className="btn btn-sm btn-primary w-50"
                onClick={handleConnectClick}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default LoginComponent;
