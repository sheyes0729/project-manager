<script setup lang="ts">
const SettingItem = defineAsyncComponent(() => import('./setting-item.vue'))
import { ipcRenderer } from '@/utils/ipc'
import { IPCFileEvents } from '@shared/config/constant'
import { IDEPickeResult } from '@shared/typings/file'
import { ResultStatus } from '@shared/typings/system'
import { layer } from '@layui/layui-vue'

const { system, setSystem } = useStore()

type IDEItem = Omit<IDEPickeResult, 'status'>

const editorList = ref<IDEItem[]>(system.value.editorList || [])

const addItem = ref<IDEItem | null>(null)

const defaultEditor = ref(system.value.defaultEditor)

async function openAdd() {
  addItem.value = {
    icon: '',
    path: ''
  }
  const data: IDEPickeResult = await ipcRenderer.invoke(IPCFileEvents.PICK_IDE_PATH)
  if (data.status == ResultStatus.REJECTED) {
    layer.notifiy({
      title: '提示！',
      content: '添加失败！',
      icon: 2
    })
  } else {
    const isExist = editorList.value.some((item) => item.path == data.path)
    if (isExist) {
      layer.notifiy({
        title: '提示！',
        content: '编辑器已存在！',
        icon: 2
      })
      return
    }
    addItem.value!.icon = data.icon
    addItem.value!.path = data.path
    editorList.value.push(addItem.value!)
    addItem.value = null
    layer.notifiy({
      title: '提示！',
      content: '添加成功！',
      icon: 1
    })
  }
}

function previewIcon(ide: IDEItem) {
  layer.photos({
    imgList: [
      {
        src: ide.icon,
        alt: ide.path
      }
    ]
  })
}

function removeIde(ide: IDEItem) {
  layer.confirm('确定删除选中项？', {
    title: '确认删除',
    btn: [
      {
        text: '确定',
        callback: (id) => {
          editorList.value = editorList.value.filter((item) => item.path != ide.path)
          if (defaultEditor.value == ide.path) {
            defaultEditor.value = ''
          }
          layer.notifiy({
            title: '提示！',
            content: '删除成功！',
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

watch(
  editorList,
  (il) => {
    setSystem(il, 'editorList')
  },
  {
    deep: true
  }
)

watch(defaultEditor, (de) => {
  setSystem(de, 'defaultEditor')
})
</script>

<template>
  <SettingItem title="编辑器配置">
    <lay-form label-position="right" label-width="120px" size="sm">
      <lay-form-item label="编辑器管理">
        <lay-space direction="vertical">
          <lay-space v-for="ide in editorList" :key="ide.path">
            <img :src="ide.icon" alt="" width="24" height="24" @click="previewIcon(ide)" />
            <lay-input v-model="ide.path" disabled />
            <RippleButton type="danger" size="xs" @click="removeIde(ide)">
              <lay-icon type="layui-icon-subtraction"></lay-icon>
            </RippleButton>
          </lay-space>
          <RippleButton type="primary" icon="layui-icon-addition" @click="openAdd"
            >添加编辑器</RippleButton
          >
        </lay-space>
      </lay-form-item>

      <lay-form-item label="默认编辑器">
        <lay-space>
          <lay-select v-model="defaultEditor" placeholder="选择默认编辑器" allow-clear>
            <lay-select-option
              v-for="item in editorList"
              :key="item.path"
              :value="item.path"
              :label="item.path"
            >
              <lay-space>
                <img :src="item.icon" alt="" width="24" height="24" />
                <span>{{ item.path }}</span>
              </lay-space>
            </lay-select-option>
          </lay-select>
          <lay-tooltip content="未绑定编辑器的项目类型默认用此打开" trigger="hover">
            <lay-icon type="layui-icon-help-circle" />
          </lay-tooltip>
        </lay-space>
      </lay-form-item>
    </lay-form>
  </SettingItem>
</template>
