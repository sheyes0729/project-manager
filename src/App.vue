<template>
  <lay-config-provider :theme="theme" :theme-variable="themeVariable">
    <router-view />
  </lay-config-provider>
</template>

<script lang="ts" setup>
import { IPCSystemEvents, IPCDBEvents } from '@shared/config/constant'
import { ipcRenderer } from '@/utils/ipc'

const { system, setSystem, setFile } = useStore()

const theme = computed(() => (system.value.theme === 'dark' ? 'dark' : 'light'))

const themeVariable = reactive({
  '--global-primary-color': '#19be6b',
  '--global-normal-color': '#3491FA',
  '--global-warm-color': '#FF7D00',
  '--global-danger-color': '#F53F3F'
})

onMounted(async () => {
  ipcRenderer.invoke(IPCDBEvents.GET_DB, 'system').then((sys) => {
    sys.theme = sys.theme || 'light'
    setSystem(sys)
    document.body.setAttribute('data-theme', sys.theme)
  })

  ipcRenderer.invoke(IPCDBEvents.GET_DB, 'file').then((file) => {
    setFile(file)
  })

  ipcRenderer.invoke(IPCSystemEvents.GET_APP_INFO).then((appInfo) => {
    setSystem(appInfo, 'appInfo')
  })
})
</script>
