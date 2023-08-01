<template>
  <h1>file</h1>
  <Button type="success" @click="scanfile">扫描</Button>
  <p>{{ text }}</p>
  <ul>
    <li v-for="file in files">
      <Space>
        <Tag color="primary">{{ file.type }}</Tag>
        <p>name: {{ file.projectName }}</p>
        <p>directory: {{ file.directory }}</p>
      </Space>
    </li>
  </ul>
</template>

<route>
  {
    meta: {
      cache: true
    }
  }
</route>

<script lang="ts" setup>
import type { FileData } from '@shared/typings/file'
import { ipcRenderer } from '@/utils/ipc'
import { IPCFileEvents } from '@shared/config/constant'

const files = ref<FileData[]>()

const text = ref('')

const { proxy } = getCurrentInstance()!

ipcRenderer.on(IPCFileEvents.SCAN_FILES_COMPLETED, (_, data: FileData[]) => {
  console.log('data: ', data)
  text.value = `扫描完成，共扫描到文件${data.length}个`
  proxy?.$Notice.success({
    title: '扫描完成！',
    desc: text.value
  })
  files.value = data
})

ipcRenderer.on(IPCFileEvents.SCAN_FILES_CANCELED, (_) => {
  proxy?.$Notice?.info({
    title: '提示',
    desc: '取消扫描！'
  })
})

function scanfile() {
  ipcRenderer.send(IPCFileEvents.SCAN_FILES_IN_DIRECTORY)
}
</script>
<style lang="scss" scoped></style>
