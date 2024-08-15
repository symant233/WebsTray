import { BrowserWindow, Tray } from 'electron';

export interface IElectronAPI {
  minimize: () => void;
  openWindow: (url: string) => Promise<[BrowserWindow, Tray]>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
