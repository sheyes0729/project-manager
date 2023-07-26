import { ipcMain } from 'electron'

export function installFile(): void {
  ipcMain.handle('open-file-in-ide', (_, ...args): string => {
    console.log('opan-file-in-ide: ', ...args)
    return 'success'
  })

  ipcMain.handle('scan-files-in-directory', (): Array<Record<string, unknown>> => {
    return [{}]
  })
}
