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
  proxy?.$Message?.success('扫描完成！')
  files.value = data
  text.value = `扫描完成，共扫描到文件${data.length}个`
})

ipcRenderer.on(IPCFileEvents.SCAN_FILES_CANCELED, (_) => {
  proxy?.$Message?.info('已取消扫描！')
})

function scanfile() {
  ipcRenderer.send(IPCFileEvents.SCAN_FILES_IN_DIRECTORY)
}
</script>
<style lang="scss" scoped></style>
