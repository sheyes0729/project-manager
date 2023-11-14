<template>
  <Space>
    <Button type="success" icon="ios-search" :loading="loading" @click="scanfile">开始扫描</Button>
    <Button type="primary" icon="ios-trash" @click="clearFile">清空</Button>
    <p>{{ text }}</p>
  </Space>
  <ul class="files-wrapper">
    <li v-for="file in files" class="file-item">
      <div class="file-icon"></div>
      <div>
        <div class="file-name">{{ file.projectName }}</div>
        <div class="file-dir">项目路径: {{ file.directory }}</div>
        <div class="file-ctime">
          创建时间：{{ proxy?.$Date(file.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
        <div class="file-utime">
          最后更新时间：{{ proxy?.$Date(file.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </div>
      <div class="file-operation">
        <Space>
          <Button type="success" @click="openFilePath(file)">打开</Button>
          <Dropdown trigger="hover">
            <Icon type="md-more" size="24" class="operation-icon"></Icon>
            <template #list>
              <DropdownMenu>
                <DropdownItem>在文件资源管理器中打开</DropdownItem>
                <DropdownItem>查看详情</DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
        </Space>
      </div>
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

const loading = ref(false)

const { proxy } = getCurrentInstance()!

ipcRenderer.on(IPCFileEvents.SCAN_FILES_COMPLETED, (_, data: FileData[]) => {
  console.log('data: ', data)
  text.value = `扫描完成，共扫描到${data.length}个项目`
  proxy?.$Notice.success({
    title: '扫描完成！',
    desc: text.value
  })
  loading.value = false
  files.value = data
  console.log('data: ', data)
})

ipcRenderer.on(IPCFileEvents.SCAN_FILES_CANCELED, (_) => {
  proxy?.$Notice?.info({
    title: '提示',
    desc: '取消扫描！'
  })
  loading.value = false
})

function scanfile() {
  loading.value = true
  ipcRenderer.send(IPCFileEvents.SCAN_FILES_IN_DIRECTORY)
}

function clearFile() {
  files.value = []
  proxy?.$Notice?.success({
    title: '提示',
    desc: '文件已清空！'
  })
}

function openFilePath(file: FileData) {
  ipcRenderer.send(IPCFileEvents.OPEN_FILE_IN_EXPLORER, file.directory)
}
</script>
<style lang="scss" scoped>
.files-wrapper {
  margin-top: $padding-small;
}
.file-item {
  @include themeify {
    background-color: themed('color-bg-aside');
  }
  border-radius: $radius-base;
  margin-bottom: $padding-base;
  padding: $padding-small;
  display: flex;
  align-items: center;
  gap: $padding-base;
  font-size: $font-mini;

  .file-icon {
    width: 64px;
    height: 64px;
    background-color: #19be6b;
    border-radius: $radius-mini;
  }

  .file-name {
    font-size: $font-extra-large;
    font-weight: $font-weight-bolder;
  }

  .file-operation {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .operation-icon {
      cursor: pointer;
    }
  }
}
</style>
