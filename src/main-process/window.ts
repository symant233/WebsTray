import { BrowserWindow, Menu, nativeImage, screen, Tray, app } from 'electron';
import path from 'path';
import { isCursorInside } from './helper';

let mainWindowInstance: BrowserWindow | null;

const appIcon = path.resolve(
  app.getAppPath(),
  MAIN_WINDOW_VITE_DEV_SERVER_URL
    ? 'public/favicon.ico'
    : '../public/favicon.ico',
);

const icon = nativeImage.createFromPath(appIcon);

// load the index.html of the app.
const _loadApp = async (window: BrowserWindow, url = '') => {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + `/#${url}`);
  } else {
    await window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      {
        hash: url,
      },
    );
  }
};

const _setPosition = (window: BrowserWindow, tray: Tray) => {
  const bounds = tray.getBounds();
  const winBounds = window.getBounds();
  window.setPosition(
    Math.floor(bounds.x - winBounds.width / 2 + bounds.width / 2),
    Math.floor(bounds.y - winBounds.height - 4),
  );
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
  mainWindowInstance = mainWindow;
  mainWindow.once('closed', () => {
    mainWindowInstance = null;
  });
  return mainWindow;
};

const createTrayWindow = async (
  url: string,
): Promise<[BrowserWindow, Tray]> => {
  const [width, height] = [460, 780];

  const tray = new Tray(icon);
  const trayWindow = new BrowserWindow({
    width,
    height,
    transparent: true,
    hiddenInMissionControl: true,
    skipTaskbar: true,
    ...options,
  });
  _setPosition(trayWindow, tray);

  await _loadApp(trayWindow, url);
  trayWindow.once('closed', () => {
    tray.destroy();
  });

  // visibility part
  tray.on('click', () => {
    if (trayWindow.isVisible()) {
      trayWindow.hide();
    } else {
      trayWindow.show();
      _setPosition(trayWindow, tray);
    }
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
      label: 'Main Window',
      click: () => {
        mainWindowInstance || createWindow();
      },
    },
    {
      type: 'separator',
    },
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
        if (e.checked) {
          trayWindow.show();
          _setPosition(trayWindow, tray);
        }
      },
    },
    {
      label: 'Exit',
      type: 'normal',
      role: 'close',
      click: () => trayWindow.close(),
    },
  ]);
  tray.setContextMenu(contextMenu);

  return [trayWindow, tray];
};

export { createWindow, createTrayWindow };
