import type Electron from 'electron';
import {
  BrowserWindow,
  ipcMain,
  nativeImage,
  Tray,
  shell,
} from 'electron';
import { applyPagePreferences, createTrayWindow } from './window';
import { isMac } from './helper';
import { setProxy, setUserAgent } from './session';
import type {
  PageWebPreferences,
  ProxySetting,
  UserAgentType,
} from '@/shared/webPreferences';

const ipcListener = (window: BrowserWindow): (() => void) => {
  ipcMain.on('minimize-window', () => {
    window.minimize();
  });
  ipcMain.on(
    'open-window',
    (_, url: string, preferences: PageWebPreferences) => {
      return createTrayWindow(url, preferences);
    },
  );
  ipcMain.on('set-proxy', (_, proxy: ProxySetting, partition?: string) => {
    void setProxy(proxy, partition);
  });
  ipcMain.on(
    'set-user-agent',
    (_, userAgentType: UserAgentType, partition?: string) => {
      setUserAgent(userAgentType, partition);
    },
  );
  ipcMain.on(
    'apply-page-preferences',
    (_, url: string, preferences: PageWebPreferences) => {
      void applyPagePreferences(url, preferences);
    },
  );
  ipcMain.on('reload-window', () => {
    window.reload();
  });
  ipcMain.on('open-external', (_, url: string) => {
    shell.openExternal(url);
  });

  return () => {
    ipcMain.removeAllListeners('minimize-window');
    ipcMain.removeAllListeners('open-window');
    ipcMain.removeAllListeners('reload-window');
    ipcMain.removeAllListeners('open-external');
    ipcMain.removeAllListeners('set-proxy');
    ipcMain.removeAllListeners('set-user-agent');
    ipcMain.removeAllListeners('apply-page-preferences');
  };
  // * required to update preload.ts after modification
};

export const trayIpcListener = (origin: string, tray: Tray) => {
  const setTrayIconListener = (
    _: Electron.IpcMainEvent,
    url: string,
    dataURL: string,
  ) => {
    if (origin !== url) return;
    let icon = nativeImage.createFromDataURL(dataURL);
    if (isMac) {
      icon = icon.resize({ width: 18, height: 18 });
    }
    tray.setImage(icon);
  };

  ipcMain.on('set-tray-icon', setTrayIconListener);
  return () => {
    ipcMain.removeListener('set-tray-icon', setTrayIconListener);
  };
};

export default ipcListener;
