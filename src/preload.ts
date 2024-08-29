// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // mainWindow ipc
  minimize: () => ipcRenderer.send('minimize-window'),
  openWindow: (url: string) => ipcRenderer.send('open-window', url),
  reload: () => ipcRenderer.send('reload-window'),
  // tray ipc
  setTrayIcon: (dataURL: string) => ipcRenderer.send('set-tray-icon', dataURL),
});
