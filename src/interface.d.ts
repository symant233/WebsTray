import { BrowserWindow, Tray } from 'electron';

export interface IElectronAPI {
  // mainWindow ipc
  minimize: () => void;
  openWindow: (url: string) => Promise<[BrowserWindow, Tray]>;
  reload: () => void;
  // tray ipc
  setTrayIcon: (dataURL: string) => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
