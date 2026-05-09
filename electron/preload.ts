import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('api', {
  win: {
    minimize: () => ipcRenderer.invoke('win:min'),
    maximize: () => ipcRenderer.invoke('win:max'),
    close:    () => ipcRenderer.invoke('win:close'),
    isMax:    () => ipcRenderer.invoke('win:ismax'),
  },
  launch:  (name: string) => ipcRenderer.invoke('app:launch', name),
  open:    (url: string)  => ipcRenderer.invoke('shell:open', url),
  version: ()             => ipcRenderer.invoke('app:version'),
})
