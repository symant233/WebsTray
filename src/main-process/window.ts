import { BrowserWindow, nativeImage, Tray } from 'electron';
import path from 'path';

const icon = nativeImage.createFromPath('src/assets/favicon.ico');

// load the index.html of the app.
const _loadApp = async (window: BrowserWindow, url = '') => {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + url);
  } else {
    await window.loadFile(
      path.join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html${url}`,
      ),
    );
  }
};

const createWindow = async (): Promise<BrowserWindow> => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    frame: false,
    maximizable: false,
    icon,
  });

  await _loadApp(mainWindow);
  return mainWindow;
};

const createTrayWindow = async (
  url: string,
): Promise<[BrowserWindow, Tray]> => {
  const tray = new Tray(icon);

  const trayWindow = new BrowserWindow({
    width: 500,
    height: 780,
    autoHideMenuBar: true,
    frame: false,
    fullscreenable: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    transparent: true,
    hiddenInMissionControl: true,
    show: false,
    icon,
  });
  await _loadApp(trayWindow, url);
  trayWindow.once('ready-to-show', () => {
    trayWindow.show();
  });
  return [trayWindow, tray];
};

export { createWindow, createTrayWindow };
