import { Channels } from 'main/preload';

import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;

        invoke(channel: Channels, args: unknown[]): Promise<any>;
      };
    };
  }
}

export {};
