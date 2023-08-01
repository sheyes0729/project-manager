<template>
  <router-view />
</template>

<script lang="ts" setup>
import { IpcDBEvents } from '@shared/config/constant'
import { ipcRenderer } from './utils/ipc'

onMounted(async () => {
  const { proxy } = getCurrentInstance()!
  proxy?.$Notice?.config({
    top: 50,
    duration: 2
  })

  const theme = (await ipcRenderer.invoke(IpcDBEvents.GET_DB, 'system.theme')) || 'light'

  document.body.setAttribute('data-theme', theme)
})
</script>
