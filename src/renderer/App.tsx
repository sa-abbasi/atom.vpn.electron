import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import React, { useState } from 'react';
import icon from '../../assets/icon.svg';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './App.css';

import LoginComponent from './components/LoginComponent';
import CountryListComponent from './components/CountryListComponent';
import LoginModel from './models/LoginModel';

export default function App() {
  const [loginInfo, setloginInfo] = useState(LoginModel);

  return (
    <Router>
      <Routes>
        <Route path="/*">
          <Route
            path="index"
            element={
              <LoginComponent
                loginInfo={loginInfo}
                setloginInfo={(newState) => setloginInfo(newState)}
              />
            }
          />

          <Route
            path="login"
            element={
              <LoginComponent
                loginInfo={loginInfo}
                setloginInfo={(newState) => setloginInfo(newState)}
              />
            }
          />

          <Route
            path="home"
            element={
              <CountryListComponent
                loginInfo={loginInfo}
                setloginInfo={(newState) => setloginInfo(newState)}
              />
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
