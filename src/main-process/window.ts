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

const options: Electron.BrowserWindowConstructorOptions = {
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
  },
  icon,
  autoHideMenuBar: true,
  frame: false,
  maximizable: false,
  fullscreenable: false,
};

const createWindow = async (): Promise<BrowserWindow> => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 680,

    ...options,
  });

  await _loadApp(mainWindow);
  return mainWindow;
};

const createTrayWindow = async (
  url: string,
): Promise<[BrowserWindow, Tray]> => {
  const [winWidth, winHeight] = [500, 780];

  const tray = new Tray(icon);
  const { x, y, width, height } = tray.getBounds();
  const trayWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    transparent: true,
    hiddenInMissionControl: true,
    // show: false,
    ...options,
  });
  trayWindow.setPosition(
    Math.floor(x - winWidth / 2 + width / 2),
    Math.floor(y - winHeight - height / 2),
  );

  await _loadApp(trayWindow, url);
  trayWindow.once('closed', () => {
    tray.destroy();
  });
  // trayWindow.once('ready-to-show', () => {
  //   trayWindow.show();
  // });
  tray.on('click', () => {
    trayWindow.isVisible() ? trayWindow.hide() : trayWindow.show();
  });
  tray.on('right-click', () => {
    trayWindow.close();
    tray.destroy();
  });
  trayWindow.on('blur', () => {
    if (!trayWindow.isAlwaysOnTop()) trayWindow.hide();
  });
  return [trayWindow, tray];
};

export { createWindow, createTrayWindow };
