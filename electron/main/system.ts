import { app, ipcMain } from 'electron'
import { IPCSystemEvents } from '../../shared/config/constant'
import { AppInfo } from '../../shared/typings/system'

export const installSystemHanlder = () => {
  ipcMain.on(IPCSystemEvents.OPEN_APP_ON_START, (_, status: boolean) => {
    app.setLoginItemSettings({
      openAtLogin: status,
      path: app.getPath('exe')
    })
  })

  ipcMain.handle(IPCSystemEvents.GET_APP_INFO, async () => {
    const gpuInfo = await app.getGPUInfo('complete')
    return <AppInfo>{
      name: app.name,
      version: app.getVersion(),
      appPath: app.getAppPath(),
      appMetrics: app.getAppMetrics(),
      gpuInfo
    }
  })
}
