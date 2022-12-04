/* eslint-disable import/prefer-default-export */
/* eslint-disable object-shorthand */
/* eslint-disable prettier/prettier */
/* eslint-disable func-names */
const channel = 'ipc-001';

const CommsFacade = {
  Connect: function (loginInfo) {
    const command = { MessageType: 2, ...loginInfo };

    const message = JSON.stringify(command);
    return window.electron.ipcRenderer.invoke(channel, message);

    // window.electron.ipcRenderer.invoke(ipcChannel, ['ping']);
  },

  Disconnect: function () {
    const command = { MessageType: 3 };

    const message = JSON.stringify(command);
    return window.electron.ipcRenderer.invoke(channel, message);
  },

  GetCountryList: function () {
    const command = { MessageType: 4 };

    const message = JSON.stringify(command);
    console.log('CommsFacade sending messagetype 4 getcountries');
    return window.electron.ipcRenderer.invoke(channel, message);
  },

  GetProtocols: function () {
    const command = { MessageType: 5 };

    const message = JSON.stringify(command);
    console.log('CommsFacade sending messagetype 5 getprotocols');
    return window.electron.ipcRenderer.invoke(channel, message);
  },

  GetCities: function () {
    const command = { MessageType: 6 };

    const message = JSON.stringify(command);
    return window.electron.ipcRenderer.invoke(channel, message);
  },

  ConnectVPN: function (VPNProps) {
    const command = { MessageType: 7, ...VPNProps };
    command['timeOut'] = 20 * 1000;
    const message = JSON.stringify(command);
    return window.electron.ipcRenderer.invoke(channel, message);
  },

  DisconnectVPN: function () {
    const command = { MessageType: 8 };

    const message = JSON.stringify(command);
    return window.electron.ipcRenderer.invoke(channel, message);
  },
};

export { CommsFacade };

/*
Socet

 public enum MessageType : int
    {
        Invalid = 1,
        Connect = 2,
        Disconnect = 3,
        GetCountryList = 4,
        GetProtocols = 5,
        GetCities = 6,
        ConnectVPN=7,
        DisConnectVPN=8
    }


0	CONNECTING	Socket has been created. The connection is not yet open.
1	OPEN	The connection is open and ready to communicate.
2	CLOSING	The connection is in the process of closing.
3	CLOSED
*/
