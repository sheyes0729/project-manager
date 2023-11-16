<template>
  <router-view />
</template>

<script lang="ts" setup>
import { IPCSystemEvents, IPCDBEvents } from '@shared/config/constant'
import { ipcRenderer } from '@/utils/ipc'
import { useStore } from '@composables/useStore'
onMounted(async () => {
  const { proxy } = getCurrentInstance()!
  proxy?.$Notice?.config({
    top: 50,
    duration: 2
  })

  const { setSystem, setFile } = useStore()
  ipcRenderer.invoke(IPCDBEvents.GET_DB, 'system').then((system) => {
    setSystem(system)
    document.body.setAttribute('data-theme', system.theme || 'light')
  })

  ipcRenderer.invoke(IPCDBEvents.GET_DB, 'file').then((file) => {
    setFile(file)
  })

  ipcRenderer.invoke(IPCSystemEvents.GET_APP_INFO).then((appInfo) => {
    setSystem(appInfo, 'appInfo')
  })
})
</script>
