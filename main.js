const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow = null
let floatingWindow = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

function createFloatingWindow() {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.show()
    floatingWindow.focus()
    return
  }
  floatingWindow = new BrowserWindow({
    width: 420,
    height: 560,
    frame: false,
    alwaysOnTop: true,
    transparent: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  // load the same UI; renderer can check query string to alter behavior if desired
  floatingWindow.loadFile(path.join(__dirname, 'index.html'), { query: { floating: '1' } })
  floatingWindow.on('closed', () => { floatingWindow = null })
}

app.whenReady().then(() => {
  createMainWindow()

  ipcMain.handle('create-floating', () => {
    createFloatingWindow()
    return true
  })

  ipcMain.handle('close-floating', () => {
    if (floatingWindow) {
      floatingWindow.close()
      floatingWindow = null
    }
    return true
  })

  ipcMain.on('set-always-on-top', (event, flag) => {
    if (floatingWindow) floatingWindow.setAlwaysOnTop(!!flag)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
