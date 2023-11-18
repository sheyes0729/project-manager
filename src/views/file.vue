<template>
  <LaySpace>
    <RippleButton type="primary" :loading="loading" icon="layui-icon-search" @click="scanfile"
      >开始扫描</RippleButton
    >
    <RippleButton type="danger" icon="layui-icon-delete" @click="clearFile">清空</RippleButton>
    <p>{{ text }}</p>
  </LaySpace>
  <div v-bind="containerProps" class="file-wrapper">
    <div v-bind="wrapperProps">
      <div v-for="f in list" class="file-item">
        <div class="file-icon"></div>
        <div>
          <div class="file-name">{{ f.data.projectName }}</div>
          <div class="file-dir">项目路径: {{ f.data.directory }}</div>
          <div class="file-ctime">
            创建时间：{{ dayjs(f.data.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div class="file-utime">
            最后更新时间：{{ dayjs(f.data.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
        <div class="file-operation">
          <LaySpace>
            <RippleButton type="normal" icon="layui-icon-component">打开项目</RippleButton>
            <lay-dropdown placement="bottom-end" update-at-scroll content-class="file-drop-content">
              <lay-icon type="layui-icon-more-vertical" style="cursor: pointer"></lay-icon>
              <template #content>
                <lay-dropdown-menu>
                  <lay-dropdown-menu-item @click="openFilePath(f.data)">
                    <lay-space>
                      <lay-icon type="layui-icon-file"></lay-icon>
                      <span>在文件资源管理器打开</span>
                    </lay-space>
                  </lay-dropdown-menu-item>
                  <lay-dropdown-menu-item @click="handleCopy(f.data.directory)">
                    <lay-space>
                      <lay-icon type="layui-icon-note"></lay-icon>
                      <span> 复制地址 </span>
                    </lay-space>
                  </lay-dropdown-menu-item>
                  <lay-dropdown-menu-item>
                    <lay-space>
                      <lay-icon type="layui-icon-show"></lay-icon>
                      <span> 查看详情 </span>
                    </lay-space>
                  </lay-dropdown-menu-item>
                </lay-dropdown-menu>
              </template>
            </lay-dropdown>
          </LaySpace>
        </div>
      </div>
      <div v-if="files?.length" class="end-line">到底了</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FileData } from '@shared/typings/file'
import { ipcRenderer } from '@/utils/ipc'
import { IPCFileEvents } from '@shared/config/constant'
import { useStore } from '@composables/useStore'
import { layer } from '@layui/layui-vue'
import dayjs from 'dayjs'

const { file, setFile } = useStore()

const files = ref<FileData[]>(file.value.list ?? [])

const text = ref('')

const loading = ref(false)

const { list, containerProps, wrapperProps } = useVirtualList(files, {
  itemHeight: 118
})

ipcRenderer.on(IPCFileEvents.SCAN_FILES_COMPLETED, (_, data: FileData[]) => {
  text.value = `扫描完成，共扫描到${data.length}个项目`
  layer.notifiy({
    title: '扫描完成！',
    content: text.value,
    icon: 1
  })
  loading.value = false
  files.value = data
  setFile(data, 'list')
})

ipcRenderer.on(IPCFileEvents.SCAN_FILES_CANCELED, () => {
  layer.notifiy({
    title: '提示！',
    content: '取消扫描！',
    icon: 4
  })
  loading.value = false
})

function scanfile() {
  loading.value = true
  ipcRenderer.send(IPCFileEvents.SCAN_FILES_IN_DIRECTORY)
}

function clearFile() {
  files.value = []
  layer.notifiy({
    title: '提示！',
    content: '文件已清空！',
    icon: 1
  })
  setFile([], 'list')
}

function openFilePath(file: FileData) {
  ipcRenderer.send(IPCFileEvents.OPEN_FILE_IN_EXPLORER, file.directory)
}

const source = ref('')
const { copy } = useClipboard({ source, legacy: true })
function handleCopy(value: string) {
  copy(value)
  layer.msg('复制成功！', { time: 1500, icon: 1 })
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

.file-drop-content {
  li {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
