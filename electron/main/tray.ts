import { Tray, Menu, BrowserWindow, app, MenuItem } from 'electron'

export const installTray = (icon: Electron.NativeImage, win: BrowserWindow): void => {
  const tray = new Tray(icon)
  tray.on('click', () => {
    win.show()
  })
  const contextMenu = Menu.buildFromTemplate([
    ...(app.isPackaged
      ? []
      : [
          {
            label: '打开调试',
            type: 'normal' as MenuItem['type'],
            click: (): void => {
              win.webContents.openDevTools()
            }
          }
        ]),
    {
      label: '显示窗口',
      type: 'normal',
      click: (): void => {
        win.show()
      }
    },
    {
      type: 'separator'
    },
    {
      label: '重启应用',
      type: 'normal',
      click: (): void => {
        app.relaunch()
        app.exit(0)
      }
    },
    {
      label: '开机启动',
      type: 'normal',
      click: (): void => {
        app.setLoginItemSettings({
          openAtLogin: true,
          path: app.getPath('exe')
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: '退出应用',
      type: 'normal',
      click: (): void => {
        win.destroy()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('Electron App')
}
