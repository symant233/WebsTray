import type Electron from 'electron';
import { app, BrowserWindow, Tray, screen } from 'electron';
import path from 'path';

export function isCursorInside(
  point: Electron.Point,
  bounds: Electron.Rectangle,
): boolean {
  if (
    point.x > bounds.x &&
    point.x < bounds.x + bounds.width &&
    point.y > bounds.y &&
    point.y < bounds.y + bounds.height
  )
    return true;
  return false;
}

export function getPublicAsset(file: string) {
  return MAIN_WINDOW_VITE_DEV_SERVER_URL
    ? path.resolve(app.getAppPath(), `public/${file}`)
    : `${process.resourcesPath}/public/${file}`;
}

export const isMac = process.platform === 'darwin';

export const userAgent = isMac
  ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  : 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36';

// macOS: menu bar at top, window appears below the tray icon
// Windows: taskbar at bottom, window appears above the tray icon
export const setTrayWindowPosition = (window: BrowserWindow, tray: Tray) => {
  const bounds = tray.getBounds();
  const winBounds = window.getBounds();
  const screenBounds = screen.getPrimaryDisplay().bounds;

  if (isMac) {
    let targetX = Math.floor(bounds.x - winBounds.width / 2 + bounds.width / 2);
    const targetY = Math.floor(bounds.y + bounds.height + 4);
    if (targetX + winBounds.width > screenBounds.width) {
      targetX = screenBounds.width - winBounds.width - 10;
    }
    if (targetX < 0) {
      targetX = 10;
    }
    window.setPosition(targetX, targetY, false);
  } else {
    if (bounds.x < 100) {
      bounds.x = screenBounds.width - winBounds.width / 2 - 50;
      bounds.y = screenBounds.height - 50;
    }

    let targetX = Math.floor(bounds.x - winBounds.width / 2 + bounds.width / 2);
    const targetY = Math.floor(bounds.y - winBounds.height - 4);
    if (targetX + winBounds.width > screenBounds.width) {
      targetX = screenBounds.width - winBounds.width - 10;
    }
    window.setPosition(targetX, targetY, false);
  }
};
