import { BrowserWindow, Menu, nativeImage, screen, Tray } from 'electron';
import path from 'path';
import { isCursorInside } from './helper';

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
  const [width, height] = [460, 780];

  const tray = new Tray(icon);
  const bounds = tray.getBounds();
  const trayWindow = new BrowserWindow({
    width,
    height,
    transparent: true,
    hiddenInMissionControl: true,
    // show: false,
    ...options,
  });
  trayWindow.setPosition(
    Math.floor(bounds.x - width / 2 + bounds.width / 2),
    Math.floor(bounds.y - height - bounds.height / 2),
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
  trayWindow.on('blur', () => {
    if (
      !trayWindow.isAlwaysOnTop() &&
      !isCursorInside(screen.getCursorScreenPoint(), tray.getBounds())
    )
      trayWindow.hide();
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Refresh',
      click: () => {
        trayWindow.reload();
      },
    },
    {
      label: 'Always On Top',
      type: 'checkbox',
      checked: false,
      click: (e: Electron.MenuItem) => {
        trayWindow.setAlwaysOnTop(e.checked);
        e.checked && trayWindow.show();
      },
    },
    { label: 'Exit', type: 'normal', click: () => trayWindow.close() },
  ]);
  tray.setContextMenu(contextMenu);

  return [trayWindow, tray];
};

export { createWindow, createTrayWindow };
