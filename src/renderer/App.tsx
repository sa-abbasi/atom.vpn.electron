import React, { useState } from 'react';
import { observer } from 'mobx-react';

import icon from '../../assets/icon.svg';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './App.css';

import { LoginStore } from './stores/LoginStore';
import { MessageStore } from './stores/MessageStore';
import { VPNPropStore } from './stores/VPNPropStore';
import { DomainStore } from './stores/DomainStore';
import { CommsFacade } from './CommsFacade';
import LoginComponent from './components/LoginComponent';
import ConnectionParameters from './components/ConnectionParameters';
import MessageLog from './components/MessageLogComponent';

export default function App() {
  const [currentState, setCurrentState] = useState(0);

  const messageStore = MessageStore;
  const domainStore = DomainStore;

  const getProtocols = () => {
    CommsFacade.GetProtocols()
      .then((result) => {
        // eslint-disable-next-line promise/always-return
        if (result.Result === undefined) {
          messageStore.addInfo(
            `cannot load protocols error: ${result.message}`
          );
        } else {
          domainStore.setProtocols(result.Result);
          messageStore.addInfo(
            `received protocols count: ${result.Result.length}`
          );
          if (domainStore.isDomainLoaded()) {
            setCurrentState(1);
          }
        }
      })
      .catch((error) => {
        const errorDetails = `protocols loading error ${error}`;
        messageStore.addError(errorDetails);
      });
  };

  // eslint-disable-next-line promise/always-return
  const getCountries = () => {
    CommsFacade.GetCountryList()

      .then((result) => {
        console.log('received countries');
        domainStore.setCountries(result.Result);
        messageStore.addInfo(`loaded countries count:${result.Result.length}`);
        // eslint-disable-next-line promise/always-return
        if (domainStore.isDomainLoaded()) {
          setCurrentState(1);
        }
      })
      .catch((error) => {
        const errorDetails = `country loading error ${error}`;
        messageStore.addError(errorDetails);
        console.log(errorDetails);
      });
  };

  const onLoginComplete = () => {
    // setloginInfo(loginResult);
    messageStore.clearStore();
    messageStore.addInfo('loading protocols from sdk');
    getProtocols();
    messageStore.addInfo('loading countries from sdk');
    getCountries();
  };

  window.electron.ipcRenderer.on('ipc-001', (arg) => {
    const data = JSON.stringify(arg);
    console.log('Renderer.App receiped electron ipcMessage ', data);
    messageStore.addInfo(data);
  });

  window.electron.ipcRenderer.OnSocketMessage((sender, data) => {
    messageStore.addInfo(data);
    console.log('App received socket message ', data);
  });

  return (
    <div>
      <LoginComponent
        loginStore={LoginStore}
        messageStore={messageStore}
        loginCompleteCallBack={() => onLoginComplete()}
      />

      {currentState === 1 && (
        <div className="mt-1">
          <ConnectionParameters
            vpnPropStore={VPNPropStore}
            domainStore={domainStore}
            messageStore={messageStore}
          />
        </div>
      )}

      <MessageLog messageStore={messageStore} />
    </div>
  );
}
