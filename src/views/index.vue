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
defineOptions({
  name: 'AppIndex'
})

const status = ref('')
const progress = ref(0)

onMounted(async () => {
  window.electron.ipcRenderer.send('logger', 'Check Version')
  window.electron.ipcRenderer.send('check-update')
  window.electron.ipcRenderer.on('update-message', (_, data) => {
    console.log('update message: ', data)
    if (data.status === 'updateAvailable') {
      status.value = '有可用更新'
    } else {
      status.value = '暂无更新'
      if (data.status === 'updateUpdating') {
        progress.value = data.progress.percent
        console.log('总计大小：', transform2MB(data.progress.total))
        console.log('已下载：', transform2MB(data.progress.transferred))
        console.log('下载速度：', transform2MB(data.progress.bytesPerSecond))
      }
      if (data.status === 'updateCompleted') {
        console.log('更新完成')
        progress.value = 100
      }
    }
  })

  const data = await window.electron.ipcRenderer.invoke('check-version')
  console.log(data)
})

function update(): void {
  window.electron.ipcRenderer.send('update-download')
}

function install(): void {
  window.electron.ipcRenderer.send('install-update')
}

function transform2MB(value: number): number {
  return Math.ceil(value / 1024 / 1024)
}
</script>
<style lang="scss" scoped></style>
