export enum IpcDBEvents {
  SET_DB = 'set-db',
  GET_DB = 'get-db'
}

export enum IPCFileEvents {
  OPEN_FILE_IN_IDE = 'open-file-in-ide',
  SCAN_FILES_IN_DIRECTORY = 'scan-files-in-directory',
  SCAN_FILES_COMPLETED = 'scan-files-completed',
  SCAN_FILES_CANCELED = 'scan-files-canceled'
}

export enum IPCLoggerEvents {
  LOGGER = 'logger'
}

export enum IPCUpdateEvents {
  CHECK_UPDATE = 'check-update',
  UPDATE_DOWNLOAD = 'update-download',
  INSTALL_UPDATE = 'install-update',
  UPDATE_MESSAGE = 'update-message',
  CHECK_VERSION = 'check-version'
}

export enum IPCWindowEvents {
  WINDOW_OPERATION = 'window-operation',
  OPEN_CHILD_WINDOW = 'open-child-window'
}
