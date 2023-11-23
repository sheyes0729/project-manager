import { app, dialog, ipcMain, shell } from 'electron'
import { scanfile } from './utils/scanfile'
import { IPCFileEvents } from '../../shared/config/constant'
import log from 'electron-log'
import { exec } from 'child_process'
import path from 'path'
import { ResultStatus } from '../../shared/typings/system'
import { IDEPickeResult } from '../../shared/typings/file'

export function installFileHanler(): void {
  log.info('install file handler...')
  // 通过IDE打开文件夹
  ipcMain.handle(IPCFileEvents.OPEN_FILE_IN_IDE, (_, idePath: string, filePath: string) => {
    exec(`${path.basename(idePath)} ${filePath}`, { cwd: path.dirname(idePath) })
    return 'success'
  })

  // 选择ide
  ipcMain.handle(IPCFileEvents.PICK_IDE_PATH, async () => {
    let status: ResultStatus = ResultStatus.PENDING,
      path = '',
      icon = ''
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile']
      })
      if (!canceled) {
        path = filePaths[0]
        if (path.endsWith('.exe')) {
          icon = (await app.getFileIcon(path)).toDataURL()
          status = ResultStatus.RESOLVED
        }
      } else {
        status = ResultStatus.REJECTED
      }
    } catch (e) {
      log.error('picke ide path error: ', e)
    }
    return <IDEPickeResult>{
      path,
      status,
      icon
    }
  })

  // 扫描文件
  ipcMain.on(IPCFileEvents.SCAN_FILES_IN_DIRECTORY, async (_, typeList: any[], dir?: string) => {
    const projectTypes = {}
    typeList.forEach((item) => {
      projectTypes[item.title] = {
        include: item.include.split(' '),
        exclude: item.exclude?.split(' ')
      }
    })
    if (dir) {
      const result = await scanfile(dir, projectTypes)
      _.reply(IPCFileEvents.SCAN_FILES_COMPLETED, result)
    } else {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (!canceled) {
        const directory = filePaths[0]
        const result = await scanfile(directory, projectTypes)
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
