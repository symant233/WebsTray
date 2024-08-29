import { BrowserWindow, ipcMain } from 'electron';
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
    ipcMain.removeAllListeners();
  };
  // * required to update preload.ts after modification
};

export default ipcListener;
