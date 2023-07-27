import { app, shell, BrowserWindow, nativeImage, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import log from 'electron-log'
import { installFile } from './file'
import { installTray } from './tray'
import { installWindow } from './window'
import { initLogger } from './log'
import { installUpdater } from './update'

initLogger()

log.debug('Starting App...')

let mainWindow: null | BrowserWindow

const preload = join(__dirname, '../preload/index.js')
const indexHTML = join(__dirname, '../renderer/index.html')
const url = process.env['ELECTRON_RENDERER_URL']

// 创建窗口
function createWindow(): void {
  // Create the browser window.
  log.debug('Create window')
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    resizable: true,
    fullscreenable: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && url) {
    mainWindow.loadURL(url)
  } else {
    mainWindow.loadFile(indexHTML)
  }
}

// 添加事件监听
function installEvents(): void {
  log.debug('Install events')
  installFile()
  installUpdater(mainWindow!)
  const iconFromPath = nativeImage.createFromPath(icon)
  installTray(iconFromPath, mainWindow!)
  installWindow(mainWindow!)
}

function setSingleInstance(): void {
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
  } else {
    app.on('second-instance', (): void => {
      if (mainWindow) {
        mainWindow.restore()
        mainWindow.show()
        mainWindow.focus()
        mainWindow.flashFrame(true)
      }
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId(app.getName())

  // 设置schema协议打开应用
  app.setAsDefaultProtocolClient(app.getName())

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  setSingleInstance()

  installEvents()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length === 0) createWindow()
    allWindows[0].focus()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  log.debug('App quiting...')
  mainWindow = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-child-window', (_, hash) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload
    }
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHTML, { hash })
  } else {
    childWindow.loadURL(`${url}/#${hash}`)
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
