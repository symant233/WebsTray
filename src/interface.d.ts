import { BrowserWindow } from 'electron';

export interface IElectronAPI {
  minimize: () => void;
  openWindow: (url: string) => Promise<BrowserWindow>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
