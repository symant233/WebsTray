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

export type UserAgentType = 'electron' | 'pc' | 'android' | 'ios';

// User Agent 字符串映射
const userAgentMap: Record<UserAgentType, string | null> = {
  electron: null, // 使用 Electron 默认 UA
  pc: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  android:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
};

// 获取 User Agent 字符串
export function getUserAgent(type: UserAgentType = 'electron'): string | null {
  return userAgentMap[type];
}

// 默认使用 Android UA（保持向后兼容）
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
