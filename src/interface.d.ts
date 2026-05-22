import type {
  PageWebPreferences,
  ProxySetting,
  UserAgentType,
} from '@/shared/webPreferences';

export interface IElectronAPI {
  // platform info
  platform: typeof process.platform;
  isMac: boolean;
  // mainWindow ipc
  minimize: () => void;
  openWindow: (url: string, preferences: PageWebPreferences) => void;
  reload: () => void;
  openExternal: (url: string) => void;
  setProxy: (proxy: ProxySetting, partition?: string) => void;
  setUserAgent: (userAgentType: UserAgentType, partition?: string) => void;
  applyPagePreferences: (url: string, preferences: PageWebPreferences) => void;
  onReloadTrayWebview: (cb: () => void) => () => void;
  // tray ipc
  setTrayIcon: (url: string, dataURL: string) => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
