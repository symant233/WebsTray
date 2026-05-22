// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import type {
  PageWebPreferences,
  ProxySetting,
  UserAgentType,
} from '@/shared/webPreferences';

contextBridge.exposeInMainWorld('electron', {
  // platform info
  platform: process.platform,
  isMac: process.platform === 'darwin',
  // mainWindow ipc
  minimize: () => ipcRenderer.send('minimize-window'),
  openWindow: (url: string, preferences: PageWebPreferences) =>
    ipcRenderer.send('open-window', url, preferences),
  reload: () => ipcRenderer.send('reload-window'),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
  setProxy: (proxy: ProxySetting, partition?: string) =>
    ipcRenderer.send('set-proxy', proxy, partition),
  setUserAgent: (userAgentType: UserAgentType, partition?: string) =>
    ipcRenderer.send('set-user-agent', userAgentType, partition),
  applyPagePreferences: (url: string, preferences: PageWebPreferences) =>
    ipcRenderer.send('apply-page-preferences', url, preferences),
  onReloadTrayWebview: (cb: () => void) => {
    const handler = () => cb();
    ipcRenderer.on('reload-tray-webview', handler);
    return () => ipcRenderer.off('reload-tray-webview', handler);
  },
  // tray ipc
  setTrayIcon: (url: string, dataURL: string) =>
    ipcRenderer.send('set-tray-icon', url, dataURL),
});
