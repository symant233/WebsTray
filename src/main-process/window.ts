import { BrowserWindow, Menu, nativeImage, screen, Tray } from 'electron';
import path from 'path';
import { getPublicAsset, isCursorInside } from './helper';
import ipcListener, { trayIpcListener } from './ipcListener';

let mainWindowInstance: BrowserWindow | null;
const trayMapper = new Map<string, [BrowserWindow, Tray]>();

const icon = nativeImage.createFromPath(getPublicAsset('WebsTray.png'));

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
  const screenBounds = screen.getPrimaryDisplay().bounds;
  if (bounds.x < 100) {
    // on tray hide
    bounds.x = screenBounds.width - winBounds.width / 2 - 50;
    bounds.y = screenBounds.height - 50;
  }
  window.setPosition(
    Math.floor(bounds.x - winBounds.width / 2 + bounds.width / 2),
    Math.floor(bounds.y - winBounds.height - 4),
  );
};

const options: Electron.BrowserWindowConstructorOptions = {
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    webviewTag: true,
    nodeIntegration: true,
  },
  icon,
  autoHideMenuBar: true,
  frame: false,
  maximizable: false,
  fullscreenable: false,
};

const createWindow = async (): Promise<BrowserWindow> => {
  if (mainWindowInstance) {
    mainWindowInstance.show();
  } else {
    const mainWindow = new BrowserWindow({
      width: 600,
      height: 680,
      ...options,
    });

    await _loadApp(mainWindow);
    mainWindowInstance = mainWindow;
    const remover = ipcListener(mainWindow);
    mainWindow.once('closed', () => {
      remover();
      mainWindowInstance = null;
    });
  }
  return mainWindowInstance;
};

const createTrayWindow = async (
  url: string,
): Promise<[BrowserWindow, Tray]> => {
  const mapper = trayMapper.get(url);
  if (mapper) {
    const [trayWindow, tray] = mapper;
    _setPosition(trayWindow, tray);
    trayWindow.show();
    return mapper;
  }

  const tray = new Tray(icon);
  const trayWindow = new BrowserWindow({
    width: 430,
    height: 780,
    transparent: true,
    hiddenInMissionControl: true,
    skipTaskbar: true,
    ...options,
  });
  _setPosition(trayWindow, tray);

  await _loadApp(trayWindow, url);
  const remover = trayIpcListener(url, tray);
  trayWindow.once('closed', () => {
    remover();
    tray.destroy();
    trayMapper.delete(url);
  });

  // visibility part
  tray.on('click', () => {
    if (trayWindow.isVisible()) {
      trayWindow.hide();
    } else {
      _setPosition(trayWindow, tray);
      trayWindow.show();
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
        createWindow();
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Tray Devtool',
      click: () => {
        trayWindow.webContents.openDevTools();
      },
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
          _setPosition(trayWindow, tray);
          trayWindow.show();
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
  tray.setToolTip('WebsTray App');

  trayMapper.set(url, [trayWindow, tray]);
  return [trayWindow, tray];
};

export { createWindow, createTrayWindow };
