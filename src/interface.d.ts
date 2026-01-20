import { BrowserWindow, Tray } from 'electron';

export interface IElectronAPI {
  // mainWindow ipc
  minimize: () => void;
  openWindow: (url: string) => Promise<[BrowserWindow, Tray]>;
  reload: () => void;
  openExternal: (url: string) => void;
  setProxy: (proxy: string) => void;
  // tray ipc
  setTrayIcon: (url: string, dataURL: string) => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
