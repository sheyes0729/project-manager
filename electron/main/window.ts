import { BrowserWindow, ipcMain } from 'electron'
export const installWindow = (win: BrowserWindow): void => {
  // 窗口操作相关
  ipcMain.on('window-operation', (_, ...args) => {
    const type = args[0]
    if (type === 'minify') {
      // 最小化
      win.minimize()
    } else if (type === 'toggleMaxize') {
      // 全屏
      if (!win.isFullScreen()) {
        win.setFullScreen(true)
      } else {
        win.setFullScreen(false)
      }
    } else if (type === 'close') {
      // 关闭窗口
      win.destroy()
    } else if (type === 'hide') {
      // 隐藏窗口
      win.hide()
    } else if (type === 'toggleTop') {
      // 窗口置顶
      const isAlwaysOnTop = win.isAlwaysOnTop
      win.setAlwaysOnTop(!isAlwaysOnTop)
    }
  })
}
