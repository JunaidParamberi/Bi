import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron'

// Define a type for the callback function in 'receive'
type IpcRendererCallback = (...args: unknown[]) => void;

// Expose the IPC Renderer API in a type-safe way
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) {
    return ipcRenderer.on(channel, listener);
  },
  off(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) {
    return ipcRenderer.off(channel, listener);
  },
  send(channel: string, ...args: unknown[]) {
    return ipcRenderer.send(channel, ...args);
  },
  invoke(channel: string, ...args: unknown[]) {
    return ipcRenderer.invoke(channel, ...args);
  },
  receive(channel: string, callback: IpcRendererCallback) {
    return ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  }
});
