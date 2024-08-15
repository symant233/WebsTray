import { BrowserWindow, ipcMain } from 'electron';
import { createTrayWindow } from './window';

const ipcListener = (window: BrowserWindow) => {
  ipcMain.on('minimize-window', () => {
    window.minimize();
  });
  ipcMain.on('open-window', (_, url: string) => {
    return createTrayWindow(url);
  });
};

export default ipcListener;
