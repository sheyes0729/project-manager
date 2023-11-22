import { IPCDBEvents } from '@shared/config/constant'
import { ipcRenderer } from '@/utils/ipc'
import { set, cloneDeep } from 'lodash'

/**
 * 共享数据
 * @returns
 */
export const useStore = createGlobalState(() => {
  const system = ref<Record<string, any>>({})

  const file = ref<Record<string, any>>({})

  const todo = ref<Record<string, any>>({})

  function setSystem(data: any, key?: string) {
    if (key) {
      set(system.value, key, data)
    } else {
      system.value = data
    }
    ipcRenderer.send(IPCDBEvents.SET_DB, 'system', cloneDeep(system.value))
  }

  function setFile(data: any, key?: string) {
    if (key) {
      set(file.value, key, data)
    } else {
      file.value = data
    }
    ipcRenderer.send(IPCDBEvents.SET_DB, 'file', cloneDeep(file.value))
  }

  function setTodo(data: any, key?: string) {
    if (key) {
      set(todo.value, key, data)
    } else {
      todo.value = data
    }
    ipcRenderer.send(IPCDBEvents.SET_DB, 'todo', cloneDeep(todo.value))
  }

  const collapsed = ref(false)

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  return {
    system,
    setSystem,
    file,
    setFile,
    collapsed,
    toggleCollapsed,
    todo,
    setTodo
  }
})
