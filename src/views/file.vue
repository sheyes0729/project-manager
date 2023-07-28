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
<script lang="ts" setup>
import type { FileData } from '@typings/file'
const ipc = window.electron.ipcRenderer

const files = ref<FileData[]>()

const text = ref('')

ipc.on('scan-files-completed', (_, data: FileData[]) => {
  console.log('data: ', data)
  files.value = data
  text.value = `扫描完成，共扫描到文件${data.length}个`
})
function scanfile() {
  ipc.send('scan-files-in-directory')
}
</script>
<style lang="scss" scoped></style>
