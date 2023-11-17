<template>
  <Space>
    <Button type="primary" icon="ios-search" :loading="loading" @click="scanfile">开始扫描</Button>
    <Button type="error" icon="ios-trash" @click="clearFile">清空</Button>
    <p>{{ text }}</p>
  </Space>
  <div v-bind="containerProps" class="file-wrapper">
    <div v-bind="wrapperProps">
      <div v-for="f in list" class="file-item">
        <div class="file-icon"></div>
        <div>
          <div class="file-name">{{ f.data.projectName }}</div>
          <div class="file-dir">项目路径: {{ f.data.directory }}</div>
          <div class="file-ctime">
            创建时间：{{ proxy?.$Date(f.data.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div class="file-utime">
            最后更新时间：{{ proxy?.$Date(f.data.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
        <div class="file-operation">
          <Space>
            <Button type="success" icon="ios-cube-outline">打开项目</Button>
            <Dropdown trigger="hover">
              <Icon type="md-more" size="24" class="operation-icon"></Icon>
              <template #list>
                <DropdownMenu>
                  <DropdownItem @click="openFilePath(f.data)">
                    <Space>
                      <Icon type="ios-folder" size="16" />
                      在文件资源管理器中打开
                    </Space>
                  </DropdownItem>
                  <DropdownItem
                    ><Space> <Icon type="ios-book" size="16" />查看详情 </Space></DropdownItem
                  >
                  <DropdownItem @click="handleCopy(f.data.directory)">
                    <Space>
                      <Icon type="ios-copy" size="18" />
                      复制地址
                    </Space>
                  </DropdownItem>
                </DropdownMenu>
              </template>
            </Dropdown>
          </Space>
        </div>
      </div>
      <div v-if="files?.length" class="end-line">到底了</div>
    </div>
  </div>
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
import { DropdownItem } from 'view-ui-plus'
import { useStore } from '@composables/useStore'

const { file, setFile } = useStore()

const files = ref<FileData[]>([])

const text = ref('')

const loading = ref(false)

const { proxy } = getCurrentInstance()!

const { list, containerProps, wrapperProps } = useVirtualList(files, {
  itemHeight: 118
})

onBeforeMount(async () => {
  files.value = file.value.list ?? []
})

ipcRenderer.on(IPCFileEvents.SCAN_FILES_COMPLETED, (_, data: FileData[]) => {
  console.log('data: ', data)
  text.value = `扫描完成，共扫描到${data.length}个项目`
  proxy?.$Notice.success({
    title: '扫描完成！',
    desc: text.value
  })
  loading.value = false
  files.value = data
  setFile(data, 'list')
})

ipcRenderer.on(IPCFileEvents.SCAN_FILES_CANCELED, () => {
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
  setFile([], 'list')
}

function openFilePath(file: FileData) {
  ipcRenderer.send(IPCFileEvents.OPEN_FILE_IN_EXPLORER, file.directory)
}

function handleCopy(value: string) {
  proxy?.$Copy({
    text: value
  })
}
</script>
<style lang="scss" scoped>
@import url('https://fonts.joway.io/css/Poppins.css');
.file-wrapper {
  margin-top: $padding-small;
  height: calc(100% - 54px);
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
    background-color: #3491fa;
    border-radius: $radius-mini;
  }

  .file-name {
    font-family: 'Poppins', sans-serif;
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

.end-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $padding-mini;
  font-size: $font-small;
  &::before,
  &::after {
    content: '';
    display: block;
    width: 10vw;
    height: 1px;
    background-color: #444;
  }
}
</style>
