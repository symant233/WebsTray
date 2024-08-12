export interface IElectronAPI {
  minimize: () => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
