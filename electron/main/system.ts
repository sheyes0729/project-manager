import { app, ipcMain, shell } from 'electron'
import { IPCSystemEvents } from '../../shared/config/constant'
import { AppInfo, ResultStatus } from '../../shared/typings/system'
import log from 'electron-log'
import { promisify } from 'util'
import { exec } from 'child_process'

const execSync = promisify(exec)

export const installSystemHanlder = () => {
  log.info('instal system handler...')
  // 开机启动
  ipcMain.on(IPCSystemEvents.OPEN_APP_ON_START, (_, status: boolean) => {
    app.setLoginItemSettings({
      openAtLogin: status,
      path: app.getPath('exe')
    })
  })

  // 应用信息
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

  // nvm相关
  ipcMain.handle(IPCSystemEvents.NVM_OPERATION, async (_, command: string, ...args: any) => {
    const commandWithArgs = ['nvm', command, ...args].join(' ')
    const { stdout, stderr } = await execSync(commandWithArgs)
    let status: ResultStatus = ResultStatus.PENDING,
      result: any = null
    if (stderr) {
      status = ResultStatus.REJECTED
      result = stderr
      return {
        status,
        data: result
      }
    }
    return {
      status: ResultStatus.RESOLVED,
      data: stdout
    }
  })

  // 打开链接
  ipcMain.on(IPCSystemEvents.OPEN_URL_EXTERNAL, (_, url: string) => {
    shell.openExternal(url)
  })
}
