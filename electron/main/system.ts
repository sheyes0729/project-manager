import { app, ipcMain } from 'electron'
import { IPCSystemEvents } from '../../shared/config/constant'

export const installSystemHanlder = () => {
  ipcMain.on(IPCSystemEvents.OPEN_APP_ON_START, (_, status: boolean) => {
    app.setLoginItemSettings({
      openAtLogin: status,
      path: app.getPath('exe')
    })
  })
}
