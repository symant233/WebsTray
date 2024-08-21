import { app } from 'electron';
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
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';
