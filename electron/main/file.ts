import { dialog, ipcMain } from 'electron'
import { scanfile } from './utils/scanfile'
import { IPCFileEvents } from '../../shared/config/constant'
export function installFile(): void {
  ipcMain.handle(IPCFileEvents.OPEN_FILE_IN_IDE, (_, ...args): string => {
    console.log(IPCFileEvents.OPEN_FILE_IN_IDE, ':', ...args)
    return 'success'
  })

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
      } else [_.reply(IPCFileEvents.SCAN_FILES_CANCELED)]
    }
  })
}
