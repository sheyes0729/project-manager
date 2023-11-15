import { IpcDBEvents } from '@shared/config/constant'
import { ipcRenderer } from '@/utils/ipc'
import { set, cloneDeep } from 'lodash'

/**
 * 共享数据
 * @returns
 */
export const useStore = createGlobalState(() => {
  const system = ref<Record<string, any>>({})

  const file = ref<Record<string, any>>({})

  function setSystem(data: any, key?: string) {
    if (key) {
      set(system.value, key, data)
    } else {
      system.value = data
    }
    ipcRenderer.send(IpcDBEvents.SET_DB, 'system', cloneDeep(system.value))
  }

  function setFile(data: any, key?: string) {
    if (key) {
      set(file.value, key, data)
    } else {
      file.value = data
    }
    ipcRenderer.send(IpcDBEvents.SET_DB, 'file', cloneDeep(file.value))
  }

  return {
    system,
    setSystem,
    file,
    setFile
  }
})
