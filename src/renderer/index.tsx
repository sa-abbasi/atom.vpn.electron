import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

const ipcChannel = 'ipc-001';

// calling IPC exposed from preload script
window.electron.ipcRenderer.once(ipcChannel, (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
// window.electron.ipcRenderer.sendMessage(ipcChannel, ['ping']);
