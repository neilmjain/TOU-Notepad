const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  createFloating: () => ipcRenderer.invoke('create-floating'),
  closeFloating: () => ipcRenderer.invoke('close-floating'),
  setAlwaysOnTop: (flag) => ipcRenderer.send('set-always-on-top', !!flag),
  on: (channel, callback) => {
    const valid = ['bounds-changed']
    if (valid.includes(channel)) {
      ipcRenderer.on(channel, (evt, ...args) => callback(...args))
    }
  }
})
