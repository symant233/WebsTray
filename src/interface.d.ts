import { BrowserWindow, Tray } from 'electron';

export interface IElectronAPI {
  // mainWindow ipc
  minimize: () => void;
  openWindow: (url: string) => Promise<[BrowserWindow, Tray]>;
  reload: () => void;
  // tray ipc
  setTrayIcon: (url: string, dataURL: string) => void;
  openExternal: (url: string) => void;
  setProxy: (proxy: stirng) => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
