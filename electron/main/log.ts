import log from 'electron-log'
import { app, ipcMain } from 'electron'
import fs from 'fs'
import { normalizePath } from './path'
import { IPCLoggerEvents } from '../../shared/config/constant'

export function initLogger(): void {
  // 设置系统日志目录
  console.log(app.getPath('logs'))
  const systemLogPath = normalizePath('logs/system')
  if (!fs.existsSync(systemLogPath)) {
    fs.mkdirSync(systemLogPath, { recursive: true })
  }
  app.setAppLogsPath(systemLogPath)

  // 设置运行日志目录
  const runtimeLogPath = normalizePath('logs/main.log')
  if (!fs.existsSync(runtimeLogPath)) {
    fs.writeFileSync(runtimeLogPath, '', 'utf-8')
  }
  log.transports.file.resolvePath = (): string => {
    return runtimeLogPath
  }

  log.transports.file.getFile()

  log.transports.console.level = 'debug'

  log.transports.file.level = 'info'

  log.transports.file.maxSize = 10 * 1024 * 1024 // 10MB

  ipcMain.on(IPCLoggerEvents.LOGGER, (_, message: any, type = 'info'): void => {
    log[type](message)
  })
}
