<script lang="ts" setup>
import type { FileData } from '@shared/typings/file'
import { ipcRenderer } from '@/utils/ipc'
import { IPCFileEvents } from '@shared/config/constant'
import { useStore } from '@composables/useStore'
import { layer } from '@layui/layui-vue'
import dayjs from 'dayjs'

const { file, setFile, system } = useStore()

const files = ref<FileData[]>(file.value.list ?? [])

const typeList = computed(() => system.value.typeList || [])

const editorList = computed(() => system.value.editorList || [])

const defaultEditor = computed(() => system.value.defaultEditor)

const text = ref('')

const loading = ref(false)

const input = ref('')
const datetime = ref([])

const filteredList = computed(() => {
  let temp = files.value.slice()
  if (input.value) {
    temp = temp.filter(
      (file) => file.directory.includes(input.value) || file.projectName.includes(input.value)
    )
  }

  if (datetime.value.length) {
    temp = temp.filter(
      (file) =>
        dayjs(file.createTime).isAfter(datetime.value[0]) &&
        dayjs(file.createTime).isBefore(datetime.value[1])
    )
  }

  return temp
})

const { list, containerProps, wrapperProps } = useVirtualList(filteredList, {
  itemHeight: 118
})

watch(
  files,
  (data) => {
    setFile(data, 'list')
  },
  {
    deep: true
  }
)

function scanfile() {
  if (!typeList.value.length) {
    layer.confirm('请先配置项目类型！', {
      title: '提示！'
    })
    return
  }
  loading.value = true
  ipcRenderer.send(
    IPCFileEvents.SCAN_FILES_IN_DIRECTORY,
    JSON.parse(JSON.stringify(typeList.value))
  )

  ipcRenderer.once(IPCFileEvents.SCAN_FILES_COMPLETED, (_, data: FileData[]) => {
    text.value = `扫描完成，共扫描到${data.length}个项目`
    layer.notifiy({
      title: '扫描完成！',
      content: text.value,
      icon: 1
    })
    loading.value = false
    files.value = data
  })

  ipcRenderer.once(IPCFileEvents.SCAN_FILES_CANCELED, () => {
    layer.notifiy({
      title: '提示！',
      content: '取消扫描！',
      icon: 4
    })
    loading.value = false
  })
}

function clearFile() {
  layer.confirm('确认清空所有项目？', {
    title: '提示！',
    btn: [
      {
        text: '确定',
        callback: (id) => {
          files.value = []
          layer.notifiy({
            title: '提示！',
            content: '文件已清空！',
            icon: 1
          })
          layer.close(id)
        }
      },
      {
        text: '取消',
        callback: (id) => {
          layer.close(id)
        }
      }
    ]
  })
}

function openFilePath(file: FileData) {
  pinFileToFirst(file)
  ipcRenderer.send(IPCFileEvents.OPEN_FILE_IN_EXPLORER, file.directory)
}

const source = ref('')
const { copy } = useClipboard({ source, legacy: true })
function handleCopy(value: string) {
  copy(value)
  layer.msg('复制成功！', { time: 1500, icon: 1 })
}

function openFileInIde(data: FileData) {
  const type = typeList.value.find((item) => item.title.toUpperCase() === data.type.toUpperCase())
  const ide = type.ide || defaultEditor.value
  if (!ide) {
    layer.confirm('请先绑定编辑器或设置默认编辑器！')
    return
  }
  pinFileToFirst(data)
  ipcRenderer.invoke(IPCFileEvents.OPEN_FILE_IN_IDE, ide, data.directory)
}

const iconMap = new Map<string, string>()
const fileIcon = computed(() => {
  return function (type: string): string {
    if (iconMap.has(type)) return iconMap.get(type)!
    let icon = ''
    const ty = typeList.value.find((item) => item.title.toUpperCase() === type.toUpperCase())
    if (ty?.ide) {
      const editor = editorList.value.find((item) => item.path === ty.ide)
      if (editor) {
        icon = editor.icon
      }
    }
    iconMap.set(type, icon)
    return icon
  }
})

function viewDetail(file: FileData) {
  console.log('file:', file)

  layer.confirm('暂不支持！', {
    title: '提示！'
  })
}

function pinFileToFirst(file: FileData) {
  const idx = files.value.findIndex((fi) => fi.directory === file.directory)
  if (idx === 0) return
  const arr = files.value.slice()
  arr.splice(idx, 1)
  arr.unshift(file)
  files.value = arr
}
</script>

<template>
  <LaySpace>
    <RippleButton type="primary" :loading="loading" icon="layui-icon-util" @click="scanfile"
      >开始扫描</RippleButton
    >
    <RippleButton type="danger" icon="layui-icon-delete" @click="clearFile">清空</RippleButton>
    <p>{{ text }}</p>
    <lay-input
      v-model="input"
      prefix-icon="layui-icon-search"
      placeholder="输入名称/路径搜索项目"
      size="sm"
      allow-clear
    />
    <lay-date-picker
      v-model="datetime"
      allow-clear
      range
      size="sm"
      type="datetime"
      :placeholder="['开始', '结束']"
    />
  </LaySpace>
  <div v-bind="containerProps" class="file-wrapper">
    <div v-bind="wrapperProps">
      <div v-for="f in list" class="file-item">
        <div class="file-icon">
          <img v-if="fileIcon(f.data.type)" :src="fileIcon(f.data.type)" alt="" />
          <div v-else class="icon-text">{{ f.data.type.slice(0, 2).toUpperCase() }}</div>
        </div>
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
            <RippleButton type="normal" icon="layui-icon-component" @click="openFileInIde(f.data)"
              >打开项目</RippleButton
            >
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
                  <lay-dropdown-menu-item @click="viewDetail(f.data)">
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
    display: grid;
    place-content: center;
    background-color: #3491fa;
    &:has(img) {
      background-color: transparent;
    }
    border-radius: $radius-mini;
    img {
      width: 48px;
    }
    .icon-text {
      font-family: 'Poppins', sans-serif;
      font-size: $font-large;
      font-weight: $font-weight-bold;
      letter-spacing: $padding-mini;
    }
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
