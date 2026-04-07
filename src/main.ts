import { app, BrowserWindow, nativeImage } from 'electron';
import { createWindow } from './main-process/window';
import session from './main-process/session';
import { getPublicAsset } from './main-process/helper';

if (process.platform === 'win32') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const squirrelStartup = require('electron-squirrel-startup');
  if (squirrelStartup) {
    app.quit();
  }
  app.commandLine.appendSwitch('wm-window-animations-disabled');
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.whenReady().then(async () => {
  if (process.platform === 'darwin' && app.dock) {
    const dockIcon = nativeImage.createFromPath(getPublicAsset('WebsTray-dock.png'));
    if (!dockIcon.isEmpty()) {
      app.dock.setIcon(dockIcon);
    }
  }
  createWindow();
  session();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('second-instance', () => {
  createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
