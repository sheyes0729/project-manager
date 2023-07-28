import { dialog, ipcMain } from 'electron'
import { scanfile } from './utils/scanfile'
export function installFile(): void {
  ipcMain.handle('open-file-in-ide', (_, ...args): string => {
    console.log('opan-file-in-ide: ', ...args)
    return 'success'
  })

  ipcMain.on('scan-files-in-directory', async (_, dir: string): Promise<void> => {
    if (dir) {
      const result = await scanfile(dir)
      _.reply('scan-files-completed', result)
    } else {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (!canceled) {
        const directory = filePaths[0]
        const result = await scanfile(directory)
        _.reply('scan-files-completed', result)
      }
    }
  })
}
