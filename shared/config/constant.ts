// 数据库操作
export enum IPCDBEvents {
  SET_DB = 'set-db',
  GET_DB = 'get-db'
}

// 文件操作
export enum IPCFileEvents {
  OPEN_FILE_IN_IDE = 'open-file-in-ide',
  OPEN_FILE_IN_EXPLORER = 'open-file-in-explorer',
  SCAN_FILES_IN_DIRECTORY = 'scan-files-in-directory',
  SCAN_FILES_COMPLETED = 'scan-files-completed',
  SCAN_FILES_CANCELED = 'scan-files-canceled'
}

// 日志打印
export enum IPCLoggerEvents {
  LOGGER = 'logger'
}

// 更新
export enum IPCUpdateEvents {
  CHECK_UPDATE = 'check-update',
  UPDATE_DOWNLOAD = 'update-download',
  INSTALL_UPDATE = 'install-update',
  UPDATE_MESSAGE = 'update-message',
  CHECK_VERSION = 'check-version'
}

// 窗口
export enum IPCWindowEvents {
  WINDOW_OPERATION = 'window-operation',
  OPEN_CHILD_WINDOW = 'open-child-window'
}

// 系统操作
export enum IPCSystemEvents {
  OPEN_APP_ON_START = 'open-app-on-start',
  GET_APP_INFO = 'get-app-info'
}
