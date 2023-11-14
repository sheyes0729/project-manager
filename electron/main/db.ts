import { LowSync, JSONFileSync } from '@commonify/lowdb'
import { ipcMain } from 'electron'
import path from 'path'
import lodash from 'lodash'
import log from 'electron-log'
import fs from 'fs'
import { normalizePath } from './path'

let db: LowSync<unknown> | null = null
export function installDB(): void {
  log.info('Install DB...')

  const fileName = 'db.json'

  const fileDirectory = normalizePath('data')

  const filePath = path.join(fileDirectory, fileName)

  if (!fs.existsSync(fileDirectory)) {
    fs.mkdirSync(fileDirectory)
  }

  const defaultData = {
    system: {},
    file: {}
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData), 'utf-8')
  }

  const adaptor = new JSONFileSync(filePath)

  db = new LowSync(adaptor)

  db.read()

  log.debug('db data: ', db.data)

  // update('system', { theme: 'light' })

  // log.debug('theme: ', result('system.theme'))

  ipcMain.on('set-db', (_, key: string, value: any) => {
    setItem(key, value)
  })

  ipcMain.handle('get-db', (_, key: string, fallback?: any) => {
    return getItem(key) ?? fallback
  })
}

function setItem(key: string, value: any): void {
  ;(db as LowSync<unknown>).read()
  lodash.update((db as LowSync<unknown>).data as any, key, () => value)
  ;(db as LowSync<unknown>).write()
}

function getItem(key: string): any {
  ;(db as LowSync<unknown>).read()
  return lodash.get((db as LowSync<unknown>).data, key)
}
