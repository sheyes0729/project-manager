import log from 'electron-log'
import { app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

export function initLogger(): void {
  // 设置系统日志目录
  const systemLogPath = path.join(process.cwd(), 'logs/system')
  if (!fs.existsSync(systemLogPath)) {
    fs.mkdirSync(systemLogPath, { recursive: true })
  }
  app.setAppLogsPath(systemLogPath)

  // 设置运行日志目录
  const runtimeLogPath = path.join(process.cwd(), 'logs/main.log')
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
