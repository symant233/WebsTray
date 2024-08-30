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
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36';
