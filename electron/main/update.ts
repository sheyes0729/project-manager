import { autoUpdater, ProgressInfo } from 'electron-updater'
import { app, BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import { UpdateMessage } from '../../shared/typings/update'
import { IPCUpdateEvents } from '../../shared/config/constant'

export interface UpdateMessageWithStatus {
  status: string
  message?: string
  progress?: ProgressInfo
}

export function installUpdaterHanlder(win: BrowserWindow): void {
  // 禁用自动更新
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  // 开发配置自动更新
  // if (!app.isPackaged) {
  //   autoUpdater.forceDevUpdateConfig = true
  // }

  const sendMsgToRender = (msg: UpdateMessageWithStatus): void => {
    win.webContents.send(IPCUpdateEvents.UPDATE_MESSAGE, msg)
  }

  // 检查更新出错
  autoUpdater.on('error', (err) => {
    sendMsgToRender({
      status: UpdateMessage.error,
      message: `${err.message}`
    })
  })

  // 有可用更新
  autoUpdater.on('update-available', () => {
    sendMsgToRender({
      status: UpdateMessage.available
    })
  })

  // 没有可用更新
  autoUpdater.on('update-not-available', () => {
    sendMsgToRender({
      status: UpdateMessage.notAvailable
    })
  })

  // 取消更新
  autoUpdater.on('update-cancelled', () => {
    sendMsgToRender({
      status: UpdateMessage.cancelled
    })
  })

  // 更新进度
  autoUpdater.on('download-progress', (progress) => {
    sendMsgToRender({
      status: UpdateMessage.updating,
      progress
    })
  })

  // 更新完成
  autoUpdater.on('update-downloaded', () => {
    sendMsgToRender({
      status: UpdateMessage.completed
    })
  })

  // 检测更新
  ipcMain.on(IPCUpdateEvents.CHECK_UPDATE, () => {
    autoUpdater.checkForUpdates()
  })

  // 检测版本
  ipcMain.handle(IPCUpdateEvents.CHECK_VERSION, () => {
    return app.getVersion()
  })

  // 开始更新
  ipcMain.on(IPCUpdateEvents.UPDATE_DOWNLOAD, () => {
    autoUpdater.downloadUpdate()
  })

  // 安装更新
  ipcMain.on(IPCUpdateEvents.INSTALL_UPDATE, () => {
    autoUpdater.quitAndInstall()
  })
}
