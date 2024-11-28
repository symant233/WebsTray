import {
  BrowserWindow,
  ipcMain,
  nativeImage,
  Tray,
  shell,
  session,
} from 'electron';
import { createTrayWindow } from './window';

const ipcListener = (window: BrowserWindow): (() => void) => {
  ipcMain.on('minimize-window', () => {
    window.minimize();
  });
  ipcMain.on('open-window', (_, url: string) => {
    return createTrayWindow(url);
  });
  ipcMain.on('reload-window', () => {
    window.reload();
  });
  ipcMain.on('open-external', (_, url: string) => {
    shell.openExternal(url);
  });
  ipcMain.on('set-proxy', (_, proxy: string) => {
    if (proxy === 'system') {
      session.defaultSession.setProxy({
        mode: proxy,
        proxyBypassRules: 'localhost',
      });
    } else {
      session.defaultSession.setProxy({
        proxyRules: proxy,
        proxyBypassRules: 'localhost',
      });
    }
    console.log(`[ipcListener.ts]: setting proxy ${proxy}`);
  });

  return () => {
    ipcMain.removeAllListeners('minimize-window');
    ipcMain.removeAllListeners('open-window');
    ipcMain.removeAllListeners('reload-window');
    ipcMain.removeAllListeners('open-external');
    ipcMain.removeAllListeners('set-proxy');
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
    const icon = nativeImage.createFromDataURL(dataURL);
    tray.setImage(icon);
  };

  ipcMain.on('set-tray-icon', setTrayIconListener);
  return () => {
    ipcMain.removeListener('set-tray-icon', setTrayIconListener);
  };
};

export default ipcListener;
