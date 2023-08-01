import { LowSync, JSONFileSync } from '@commonify/lowdb'
import { app, ipcMain } from 'electron'
import path from 'path'
import lodash from 'lodash'
import log from 'electron-log'
import fs from 'fs'
import { normalizePath } from './path'

export function installDB() {
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

  if (!app.isPackaged || !fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData), 'utf-8')
  }

  const adaptor = new JSONFileSync(filePath)

  const db = new LowSync(adaptor)

  db.read()

  log.debug('db data: ', db.data)

  // update('system', { theme: 'light' })

  // log.debug('theme: ', result('system.theme'))

  function update(key: string, value: any) {
    db.read()
    lodash.update(db.data as Object, key, () => value)
    db.write()
  }

  function result(key: string) {
    db.read()
    return lodash.get(db.data, key)
  }

  ipcMain.on('set-db', (_, key: string, value: any) => {
    update(key, value)
  })

  ipcMain.handle('get-db', (_, key: string) => {
    return result(key)
  })
}
