import type Electron from 'electron';
import { BrowserWindow, Menu, nativeImage, screen, Tray } from 'electron';
import path from 'path';
import {
  getPublicAsset,
  isCursorInside,
  isMac,
  setTrayWindowPosition,
} from './helper';
import ipcListener, { trayIpcListener } from './ipcListener';
import { mainWindowBounds, trayWindowBounds } from './constant';

let mainWindowInstance: BrowserWindow | null;
const trayMapper = new Map<string, [BrowserWindow, Tray]>();

const appIcon = nativeImage.createFromPath(getPublicAsset('WebsTray.png'));
// macOS menu bar icons should be ~18px to match system icon sizes
const trayIcon = isMac ? appIcon.resize({ width: 18, height: 18 }) : appIcon;

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

const options: Electron.BrowserWindowConstructorOptions = {
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    webviewTag: true,
    nodeIntegration: true,
  },
  icon: appIcon,
  autoHideMenuBar: true,
  frame: false,
  maximizable: false,
  fullscreenable: false,
  ...(isMac && { titleBarStyle: 'hiddenInset' as const, trafficLightPosition: { x: 12, y: 22 } }),
};

const createWindow = async (): Promise<BrowserWindow> => {
  if (mainWindowInstance) {
    mainWindowInstance.show();
  } else {
    const mainWindow = new BrowserWindow({
      ...mainWindowBounds,
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
    setTrayWindowPosition(trayWindow, tray);
    trayWindow.show();
    return mapper;
  }

  const tray = new Tray(trayIcon);
  const trayWindow = new BrowserWindow({
    ...trayWindowBounds,
    transparent: true,
    resizable: true,
    hiddenInMissionControl: true,
    skipTaskbar: true,
    hasShadow: false,
    ...(!isMac && { thickFrame: false }), // thickFrame is Windows-only
    ...options,
    ...(isMac && { titleBarStyle: 'default' as const, frame: false }), // override hiddenInset for tray popups
  });

  await _loadApp(trayWindow, url);
  setTrayWindowPosition(trayWindow, tray);
  const remover = trayIpcListener(url, tray);
  trayWindow.once('closed', () => {
    remover();
    tray.destroy();
    trayMapper.delete(url);
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
      checked: isMac,
      click: (e: Electron.MenuItem) => {
        trayWindow.setAlwaysOnTop(e.checked);
        if (e.checked) {
          setTrayWindowPosition(trayWindow, tray);
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

  if (isMac) {
    trayWindow.setAlwaysOnTop(true);
  }

  // macOS: click toggles window, option+click or right-click shows context menu
  // Windows: click toggles window, right-click shows context menu (via setContextMenu)
  tray.on('click', (event) => {
    if (isMac && event.altKey) {
      tray.popUpContextMenu(contextMenu);
      return;
    }
    if (trayWindow.isVisible()) {
      trayWindow.hide();
    } else {
      trayMapper.forEach(([win]) => win.hide());
      setTrayWindowPosition(trayWindow, tray);
      trayWindow.show();
    }
  });

  if (isMac) {
    tray.on('right-click', () => {
      tray.popUpContextMenu(contextMenu);
    });
  } else {
    tray.setContextMenu(contextMenu);
  }

  trayWindow.on('blur', () => {
    if (
      !trayWindow.isAlwaysOnTop() &&
      !isCursorInside(screen.getCursorScreenPoint(), tray.getBounds())
    )
      trayWindow.hide();
  });

  tray.setToolTip('WebsTray App');

  trayMapper.set(url, [trayWindow, tray]);
  return [trayWindow, tray];
};

export { createWindow, createTrayWindow };
