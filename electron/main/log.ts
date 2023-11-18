import log from 'electron-log'
import { app, ipcMain } from 'electron'
import fs from 'fs'
import { IPCLoggerEvents } from '../../shared/config/constant'
import path from 'path'

export function initLogger(): void {
  // 设置系统日志目录
  const logDirectory = app.getPath('logs')
  // 设置运行日志目录
  const runtimeLogPath = path.join(logDirectory, 'runtime.log')
  if (!fs.existsSync(runtimeLogPath)) {
    fs.writeFileSync(runtimeLogPath, '', 'utf-8')
  }
  log.transports.file.resolvePath = (): string => {
    return runtimeLogPath
  }

  log.transports.file.getFile()

  log.transports.console.level = 'debug'

  log.transports.file.level = 'info'

  log.transports.file.maxSize = 2 * 1024 * 1024 // 10MB

  ipcMain.on(IPCLoggerEvents.LOGGER, (_, message: any, type = 'info'): void => {
    log[type](message)
  })
}
