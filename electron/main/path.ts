import { app } from 'electron'
import path from 'path'

export function normalizePath(dir: string) {
  return path.join(process.cwd(), app.isPackaged ? 'resources/app.asar.unpacked' : '', dir)
}
