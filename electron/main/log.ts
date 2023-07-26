import log from 'electron-log'
import { join } from 'path'

export function initLogger(): void {
  log.transports.file.resolvePath = (variables, message): string => {
    console.log(variables, message)
    return join(__dirname, '../../resources/logs/main.log')
  }

  log.transports.console.level = 'debug'

  log.transports.file.level = 'info'

  log.transports.file.maxSize = 10 * 1024 * 1024 // 10MB
}
