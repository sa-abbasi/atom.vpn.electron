/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommsFacade } from '../CommsFacade';

const LoginComponent = ({ loginInfo, setloginInfo }) => {
  const navigate = useNavigate();

  const [nameError, setnameError] = useState('');
  const [passwordError, setpasswordError] = useState('');
  const [pskError, setpskError] = useState('');

  const commsFacade = CommsFacade;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setloginInfo({
      ...loginInfo,
      [name]: value,
    });
  };

  const validatePassword = () => {
    const password = loginInfo.password;
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
    // history.push('/home');
    console.log('LoginComp.handleConnectClick called');

    validateInput();

    if (!loginInfo.isValid()) {
      return;
    }

    commsFacade
      .Connect(loginInfo)
      .then((result) => {
        console.log(`result received from commsFacade ${result}`);
        if (result.IsOK) {
          navigate('/home');
        }
      })
      .catch((error) => {
        debugger;
        console.log(`error ${error}`);
      });
  };

  return (
    <>
      <div
        className="Card bg-secondary p-4 rounded-3"
        style={{ minWidth: '400px' }}
      >
        <div className="card-header my-3">
          <h4 className="card-title text-center"> Enter Credendentials</h4>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="psk">Preshared Security Key:</label>
            <input
              type="text"
              name="psk"
              value={loginInfo.psk}
              className="form-control"
              placeholder="Enter PSK"
              id="psk"
              minLength={10}
              maxLength={50}
              required
              onChange={handleInputChange}
            />
            {renderErrorMessage('psk')}
          </div>

          <div className="form-group mt-2">
            <label htmlFor="username">User Name:</label>
            <input
              type="text"
              name="username"
              value={loginInfo.username}
              className="form-control"
              placeholder="Enter User Name"
              id="username"
              minLength={4}
              maxLength={12}
              required
              onChange={handleInputChange}
            />
            {renderErrorMessage('username')}
          </div>

          <div className="form-group mt-2">
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              name="password"
              id="password"
              value={loginInfo.password}
              className="form-control"
              placeholder="Enter Password"
              minLength={4}
              maxLength={12}
              required
              onChange={handleInputChange}
            />
            {renderErrorMessage('password')}
          </div>

          <div className="form-group mt-4 text-center ">
            <button
              type="button"
              className="btn btn-sm btn-primary w-50"
              onClick={handleConnectClick}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginComponent;
