<template>
  <h1>AppIndex</h1>
  <Button type="primary" @click="$router.push('/about')">go about</Button>
  <Space direction="vertical">
    <Tag color="primary">
      {{ status }}
    </Tag>
    <Button @click="update">更新</Button>
    <Circle :percent="progress">
      <span style="font-size: 24px">{{ progress }}%</span>
    </Circle>
    <Button type="success" @click="install">立即更新</Button>
  </Space>
</template>

<route>
  {
    meta: {
      cache: true
    }
  }

</route>

<script lang="ts" setup>
import { ipcRenderer } from '@/utils/ipc'
import { IPCLoggerEvents, IPCUpdateEvents } from '@shared/config/constant'
import { UpdateMessage } from '@shared/typings/update'

defineOptions({
  name: 'AppIndex'
})

const status = ref('')
const progress = ref(0)

onMounted(async () => {
  ipcRenderer.send(IPCLoggerEvents.LOGGER, 'Check Version')
  ipcRenderer.send(IPCUpdateEvents.CHECK_UPDATE)
  ipcRenderer.on(IPCUpdateEvents.UPDATE_MESSAGE, (_, data) => {
    console.log('update message: ', data)
    switch (data.status) {
      case UpdateMessage.available:
        status.value = '有可用更新'
        break

      case UpdateMessage.notAvailable:
        status.value = '暂无更新'
        break

      case UpdateMessage.updating:
        progress.value = data.progress.percent
        console.log('总计大小：', transform2MB(data.progress.total))
        console.log('已下载：', transform2MB(data.progress.transferred))
        console.log('下载速度：', transform2MB(data.progress.bytesPerSecond))
        break

      case UpdateMessage.completed:
        console.log('更新完成')
        progress.value = 100
        break
    }
  })

  const version = await ipcRenderer.invoke(IPCUpdateEvents.CHECK_VERSION)
  console.log('version: ', version)
})

function update(): void {
  ipcRenderer.send(IPCUpdateEvents.UPDATE_DOWNLOAD)
}

function install(): void {
  ipcRenderer.send(IPCUpdateEvents.INSTALL_UPDATE)
}

function transform2MB(value: number): number {
  return Math.ceil(value / 1024 / 1024)
}
</script>
<style lang="scss" scoped></style>
