<script lang="ts" setup>
import { ipcRenderer } from '@/utils/ipc'
import { IPCSystemEvents } from '@shared/config/constant'

const version = ref('')

const availableList = ref<string[]>([])
const installedList = ref<string[]>([])
const current = ref('')
const app = inject('app') as any
const loading = ref(false)

onBeforeMount(() => {
  initData()
})

async function initData() {
  loading.value = true
  await getNvmVersion()
  await getNvmList(false)
  await getNvmList()
  loading.value = false
}

async function getNvmVersion() {
  try {
    const data = await ipcRenderer.invoke(IPCSystemEvents.NVM_OPERATION, 'version')
    version.value = data.data
  } catch (e) {
    console.log('e: ', e)
  }
}

async function getNvmList(remote = true) {
  if (!version.value) return
  if (remote) {
    availableList.value = []
  } else {
    installedList.value = []
  }
  try {
    const data = await ipcRenderer.invoke(
      IPCSystemEvents.NVM_OPERATION,
      ...(remote ? ['list', 'available'] : ['list'])
    )
    if (remote) {
      const reg = /\n(\|\s+[\w.\s]*\s+\|)/g
      const res = data.data.match(reg)
      availableList.value =
        res?.slice(1)?.map((item: string) => item.replace(/[\r\n\s|]/g, '')) ?? []
    } else {
      const currentReg = /\*\s+(\w+\.\w+\.\w+)/g
      const reg = /(\w+\.\w+\.\w+)/g
      current.value = data.data.match(currentReg)?.[0]?.replace(/[*\s]/g, '')

      installedList.value = data.data.match(reg)
    }
  } catch (e) {
    console.log('e: ', e)
  }
}

const columns = [
  {
    title: '序号',
    type: 'number',
    align: 'center',
    width: '80px'
  },
  {
    title: '版本',
    key: 'version',
    align: 'center',
    sort: 'desc'
  },
  {
    title: '状态',
    customSlot: 'status',
    align: 'center'
  },
  {
    title: '操作',
    customSlot: 'action',
    align: 'center'
  }
]

const resolvedList = computed(() => {
  const installed = installedList.value.map((item) => ({
    version: item,
    status: item === current.value ? 'current' : 'installed'
  }))

  return installed.concat(
    availableList.value
      .filter((item) => !installed.find((it) => it.version === item))
      .map((item) => ({
        version: item,
        status: 'available'
      }))
  )
})

function refresh() {
  app?.reload()
}
</script>

<template>
  <lay-space direction="vertical">
    <LaySpace>
      <LayTag type="primary">nvm版本：{{ version }}</LayTag>
      <LayTag type="normal">当前node版本：{{ current }}</LayTag>
      <RippleButton type="primary" icon="layui-icon-refresh-one" @click="getNvmList(false)"
        >本地更新</RippleButton
      >
      <RippleButton type="normal" icon="layui-icon-refresh" @click="getNvmList"
        >远程更新</RippleButton
      >
      <RippleButton type="warm" icon="layui-icon-refresh" @click="refresh">全局刷新</RippleButton>
    </LaySpace>
    <LayTable
      even
      size="sm"
      resize
      default-toolbar
      :columns="columns"
      :data-source="resolvedList"
      :loading="loading"
      max-height="calc(100vh - 120px)"
    >
      <template #status="{ row }">
        <LayTag v-if="'current' == row.status" type="warm" size="sm">{{ row.status }}</LayTag>
        <LayTag v-if="'installed' == row.status" type="normal" size="sm">{{ row.status }}</LayTag>
        <LayTag v-if="'available' == row.status" type="danger" size="sm">{{ row.status }}</LayTag>
      </template>

      <template #action="{ row }">
        <RippleButton v-if="'available' == row.status" type="normal" size="xs">安装</RippleButton>
        <RippleButton v-else type="primary" size="xs">更多</RippleButton>
      </template>
    </LayTable>
  </lay-space>
</template>

<style lang="scss" scoped></style>
