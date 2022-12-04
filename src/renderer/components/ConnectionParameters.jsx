/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { CommsFacade } from '../CommsFacade';
import CSelect from './CSelectComponent';

const ConnectionParameters = observer(
  ({ vpnPropStore, domainStore, messageStore }) => {
    const [protocols, setProtocols] = useState([]);
    const [countries, setCountries] = useState([]);

    const [isInitialized, setIsInitialized] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const SetPrimaryProtocol = (newVal) => {
      vpnPropStore.vpnProps.primaryProtocol = newVal;

      /*
      const tempCountries = domainStore.plainCountries.filter(
        (c) => c.protocols.filter((p) => p.protocol === 'SSTP').length > 0
      );
       setCountries(tempCountries);
      */
    };

    const SetSecondaryProtocol = (newVal) => {
      vpnPropStore.vpnProps.secondaryProtocol = newVal;
    };

    const SetTertiaryProtocol = (newVal) => {
      vpnPropStore.vpnProps.tertiaryProtocol = newVal;
    };

    const SetSelectedCountry = (newVal) => {
      vpnPropStore.vpnProps.country = newVal;

      // setSelectedProtocol(e.target.value);
      // const idx = e.target.value;

      // const sprotocol = protocols.filter((item) => item.name === e.target.value);
      // const rr = sprotocol;
    };

    const handleConnectClick = (e) => {};

    const ShowProtocols = () => {
      return <span>{protocols.length}</span>;
    };

    const Initialize = () => {
      if (isInitialized) return;

      setProtocols(domainStore.plainProtocols);
      setCountries(domainStore.plainCountries);

      if (domainStore.plainProtocols.length > 0) {
        const pp = domainStore.plainProtocols;
        SetPrimaryProtocol(pp[0].value);
        SetSecondaryProtocol(pp[1].value);
        SetTertiaryProtocol(pp[2].value);
      }

      if (domainStore.plainCountries.length > 0) {
        const cc = domainStore.plainCountries;
        SetSelectedCountry(cc[0].value);
      }

      setIsInitialized(true);
    };

    Initialize();

    const ConnectVPN = () => {
      messageStore.addInfo(`connecting vpn`);
      const normalProps = vpnPropStore.getPlainProps();

      CommsFacade.ConnectVPN(normalProps)
        // eslint-disable-next-line promise/always-return
        .then((result) => {
          messageStore.addInfo(
            `received ConnectVPN result IsOK: ${result.IsOK}`
          );
          messageStore.addInfo(JSON.stringify(result));
          if (result.IsOK) {
            setIsConnected(true);
          }
        })
        .catch((error) => {
          const errorDetails = `VPN Connection Error ${error}`;
          messageStore.addError(errorDetails);
          console.log(errorDetails);
        });
    };

    const DisconnectVPN = () => {
      messageStore.addInfo(`disconnecting vpn`);
      const normalProps = vpnPropStore.getPlainProps();

      CommsFacade.DisconnectVPN()
        // eslint-disable-next-line promise/always-return
        .then((result) => {
          messageStore.addInfo(
            `VPN Disconnection Command Status : ${result.IsOK}`
          );
          messageStore.addInfo(JSON.stringify(result));
          if (result.IsOK || result.Message.includes('disconnected')) {
            setIsConnected(false);
          }
        })
        .catch((error) => {
          const errorDetails = `VPN Disconnection Error ${error}`;
          messageStore.addError(errorDetails);
        });
    };

    const ConnectionState = () => {
      if (isConnected) {
        return (
          <div className="me-auto ms-auto w-75">
            Connection State:
            <span className="text-success bg-white mx-1 px-3 rounded-4 ">
              {' '}
              Connected
            </span>
          </div>
        );
      }

      return (
        <div className="me-auto ms-auto w-75">
          Connection State:
          <span className="text-danger bg-warning mx-1 px-2 rounded-4">
            {' '}
            Not Connected
          </span>
        </div>
      );
    };

    return (
      <div className="Center-Item">
        <div
          className="Card bg-secondary p-4 rounded-3"
          style={{ minWidth: '400px', maxWidth: '500px' }}
        >
          <ConnectionState />
          <div className="card-header mb-3">
            <h5 className="card-title text-center">
              Choose Connection Parameters
            </h5>
          </div>
          <div className="card-body">
            <div className="mx-auto" style={{ width: 'fit-content' }}>
              <CSelect
                label="Select Primary Protocol:"
                items={protocols}
                selectedValue={protocols.length > 0 ? protocols[0].value : 0}
                OnSelected={(val) => SetPrimaryProtocol(val)}
              />
              <CSelect
                label="Select Secondary Protocol:"
                items={protocols}
                selectedValue={protocols.length > 0 ? protocols[1].value : 0}
                OnSelected={(val) => SetSecondaryProtocol(val)}
              />
              <CSelect
                label="Select Tertiary Protocol:"
                items={protocols}
                selectedValue={protocols.length > 0 ? protocols[2].value : 0}
                OnSelected={(val) => SetTertiaryProtocol(val)}
              />
              <CSelect
                label="Select Country:"
                items={countries}
                selectedValue={countries.length > 0 ? countries[0].value : 0}
                OnSelected={(val) => SetSelectedCountry(val)}
              />
            </div>

            <div>
              <div className="form-group mt-4 text-center ">
                <button
                  type="button"
                  className="btn btn-sm btn-primary w-50"
                  onClick={ConnectVPN}
                >
                  Connect VPN
                </button>
              </div>
              <div className="form-group mt-2 text-center ">
                <button
                  type="button"
                  className="btn btn-sm btn-danger w-50"
                  onClick={DisconnectVPN}
                >
                  Disconnect VPN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ConnectionParameters;
