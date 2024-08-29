import { BrowserWindow, ipcMain, nativeImage, Tray } from 'electron';
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

  return () => {
    ipcMain.removeAllListeners('minimize-window');
    ipcMain.removeAllListeners('open-window');
    ipcMain.removeAllListeners('reload-window');
  };
  // * required to update preload.ts after modification
};

export const trayIpcListener = (tray: Tray) => {
  const listener = (_: Electron.IpcMainEvent, dataURL: string) => {
    const icon = nativeImage.createFromDataURL(dataURL);
    tray.setImage(icon);
  };

  ipcMain.on('set-tray-icon', listener);
  return () => ipcMain.removeListener('set-tray-icon', listener);
};

export default ipcListener;
