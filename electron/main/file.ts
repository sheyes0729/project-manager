import { dialog, ipcMain, shell } from 'electron'
import { scanfile } from './utils/scanfile'
import { IPCFileEvents } from '../../shared/config/constant'
export function installFileHanler(): void {
  // 通过IDE打开文件夹
  ipcMain.handle(IPCFileEvents.OPEN_FILE_IN_IDE, (_, ...args): string => {
    console.log(IPCFileEvents.OPEN_FILE_IN_IDE, ':', ...args)
    return 'success'
  })

  // 扫描文件
  ipcMain.on(IPCFileEvents.SCAN_FILES_IN_DIRECTORY, async (_, dir: string): Promise<void> => {
    if (dir) {
      const result = await scanfile(dir)
      _.reply(IPCFileEvents.SCAN_FILES_COMPLETED, result)
    } else {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (!canceled) {
        const directory = filePaths[0]
        const result = await scanfile(directory)
        _.reply(IPCFileEvents.SCAN_FILES_COMPLETED, result)
      } else {
        _.reply(IPCFileEvents.SCAN_FILES_CANCELED)
      }
    }
  })

  // 在文件资源管理器打开文件
  ipcMain.on(IPCFileEvents.OPEN_FILE_IN_EXPLORER, (_, dir: string) => {
    shell.showItemInFolder(dir)
  })
}
