<template>
  <lay-config-provider :theme="theme" :theme-variable="themeVariable">
    <router-view />
    <el-dialog v-model="visible" title="更新" append-to-body>
      <div style="display: grid; place-content: center">
        <lay-progress percent="10" circle show-text />
      </div>
    </el-dialog>
  </lay-config-provider>
</template>

<script lang="ts" setup>
import { IPCSystemEvents, IPCDBEvents, IPCUpdateEvents } from '@shared/config/constant'
import { ipcRenderer } from '@/utils/ipc'
import { UpdateMessage } from '@shared/typings/update'
import { layer } from '@layui/layui-vue'

const { system, setSystem, setFile, setTodo } = useStore()

const theme = computed(() => (system.value.theme === 'dark' ? 'dark' : 'light'))

const themeVariable = reactive({
  '--global-primary-color': '#19be6b',
  '--global-normal-color': '#3491FA',
  '--global-warm-color': '#FF7D00',
  '--global-danger-color': '#F53F3F'
})

const visible = ref(false)
const progress = ref(0)

const route = useRoute()
onMounted(async () => {
  ipcRenderer.invoke(IPCDBEvents.GET_DB, 'system').then((sys) => {
    sys.theme = sys.theme || 'light'
    sys.updatePolicy = sys.updatePolicy || 'auto'
    setSystem(sys)
    document.body.setAttribute('data-theme', sys.theme)
    if (sys.updatePolicy === 'auto') {
      ipcRenderer.send(IPCUpdateEvents.CHECK_UPDATE)

      ipcRenderer.on(IPCUpdateEvents.UPDATE_MESSAGE, (_, data) => {
        switch (data.status) {
          case UpdateMessage.available:
            layer.confirm('♻️ 是否立即下载并更新？', {
              title: '✔️ 有可用更新',
              btn: [
                {
                  text: '确定',
                  callback: (id: any) => {
                    ipcRenderer.send(IPCUpdateEvents.UPDATE_DOWNLOAD)
                    layer.close(id)
                    visible.value = true
                  }
                },
                {
                  text: '取消',
                  callback: (id: any) => {
                    layer.close(id)
                    layer.notifiy({
                      title: '提示',
                      content: '已取消更新！'
                    })
                  }
                }
              ]
            })
            break
          case UpdateMessage.notAvailable:
            if (route.path === '/about') {
              layer.confirm('当前已是最新版本！', {
                title: '提示'
              })
            }
            break
          case UpdateMessage.updating:
            progress.value = data.progress.percent
            break
          case UpdateMessage.completed:
            progress.value = 100
            ipcRenderer.send(IPCUpdateEvents.INSTALL_UPDATE)
            break
          case UpdateMessage.error:
            layer.notifiy({
              title: '提示',
              content: '更新失败！',
              icon: 2
            })
            break
        }
      })
    }
  })

  ipcRenderer.invoke(IPCDBEvents.GET_DB, 'file').then((file) => {
    setFile(file)
  })

  ipcRenderer.invoke(IPCDBEvents.GET_DB, 'todo').then((todo) => {
    setTodo(todo ?? {})
  })

  ipcRenderer.invoke(IPCSystemEvents.GET_APP_INFO).then((appInfo) => {
    setSystem(appInfo, 'appInfo')
  })
})
</script>
