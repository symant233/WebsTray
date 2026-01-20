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

export const userAgent =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36';

export const setTrayWindowPosition = (window: BrowserWindow, tray: Tray) => {
  const bounds = tray.getBounds();
  const winBounds = window.getBounds();
  const screenBounds = screen.getPrimaryDisplay().bounds;
  if (bounds.x < 100) {
    // on tray hide
    bounds.x = screenBounds.width - winBounds.width / 2 - 50;
    bounds.y = screenBounds.height - 50;
  }

  let targetX = Math.floor(bounds.x - winBounds.width / 2 + bounds.width / 2);
  const targetY = Math.floor(bounds.y - winBounds.height - 4);
  if (targetX + winBounds.width > screenBounds.width) {
    // on window overflow
    targetX = screenBounds.width - winBounds.width - 10;
  }
  window.setPosition(targetX, targetY, false);
};
