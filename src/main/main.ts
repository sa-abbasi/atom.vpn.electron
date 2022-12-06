/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import * as path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { SdkChannel } from './SdkChannel';

const { execFile } = require('node:child_process');

const sdkChannel = new SdkChannel('abc');

const ipcChannel = 'ipc-001';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on(ipcChannel, async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  console.log(`ipcMain.on received event ${event} with args ${arg}`);

  event.reply(ipcChannel, msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = true;
// process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const ShowLogMessage = (strMessage: string) => {
  mainWindow.webContents.send('socket-message', strMessage);
};

const startSDKProcess = () => {
  console.log('starting sdk process');
  // const executablePath =  'D:/vpn_app/atomvpnapp-win32-x64/resources/console_app/Atom.VPN.Console.exe';

  const configFile = path.join(path.dirname(__dirname), 'config.json');

  setTimeout(() => {
    ShowLogMessage(`Configuration file path ${configFile}`);
  }, 3000);

  const fs = require('fs');
  let rawdata = fs.readFileSync(configFile);

  const config = JSON.parse(rawdata);
  const executablePath = config.vpnConsoleExePath;

  setTimeout(() => {
    ShowLogMessage(`Starting VPN Console process ${executablePath}`);
  }, 3000);

  const child = execFile(
    executablePath,
    ['from_electron'],
    (error, stdout, stderr) => {
      if (error) {
        setTimeout(() => {
          ShowLogMessage(
            `Cannot start VPN Console process due to error ${error}`
          );
        }, 3000);
        console.log(`Cannot start dotnet application error: ${error}`);
      }
      // console.log(stdout);
    }
  );
};
// End of startSDKProcess

async function handleIPCEvent(event: any, arg: any) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  console.log(`main-main.ts->handleIPCEvent received command ${arg}`);

  /*
  Invalid = 1,
  Connect = 2,
  Disconnect = 3,
  GetCountryList = 4,
  GetProtocols = 5,
  GetCities = 6,
  ConnectVPN=7,
  DisconnectVPN=8
*/

  const command = JSON.parse(arg);

  return sdkChannel.ProcessCommand(command);
}

const SetMessageForwarder = () => {
  sdkChannel.MessageForwarder = (args) => {
    mainWindow.webContents.send('socket-message', args);
  };
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  ipcMain.handle(ipcChannel, handleIPCEvent);

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

// End of createWindow

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    SetMessageForwarder();
    startSDKProcess();
  })
  .catch(console.log);
