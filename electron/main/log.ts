import log from 'electron-log'
import { app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

export function initLogger(): void {
  // 设置系统日志目录
  app.setAppLogsPath(path.join(app.getAppPath(), 'logs/system'))

  // 修改数据位置，C盘装不下了你个不良应用，开发环境会不断刷新
  // const userDataPath = path.join(app.getAppPath(), 'data/userData')
  // const sessionDataPath = path.join(app.getAppPath(), 'data/sessionData')

  // if (!fs.existsSync(userDataPath)) {
  //   fs.mkdirSync(userDataPath, { recursive: true })
  // }

  // app.setPath('userData', userDataPath)

  // if (!fs.existsSync(sessionDataPath)) {
  //   fs.mkdirSync(sessionDataPath, { recursive: true})
  // }

  // app.setPath('sessionData', sessionDataPath)

  // 设置运行日志目录
  log.transports.file.resolvePath = (): string => {
    return path.join(app.getAppPath(), 'logs/main.log')
  }

  log.transports.file.getFile()

  log.transports.console.level = 'debug'

  log.transports.file.level = 'info'

  log.transports.file.maxSize = 10 * 1024 * 1024 // 10MB

  ipcMain.on('logger', (_, ...args): void => {
    let type = 'info'
    let message = ''
    if (args.length > 1) {
      type = args[0]
      message = args[1]
    } else {
      message = args[0]
    }
    log[type](message)
  })
}
