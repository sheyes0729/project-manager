<script lang="ts" setup>
import { ipcRenderer } from '@/utils/ipc'
import { IPCFileEvents } from '@shared/config/constant'
import { IDEPickeResult } from '@shared/typings/file'

const state = reactive({
  icon: '',
  path: ''
})

async function test() {
  const data: IDEPickeResult = await ipcRenderer.invoke(IPCFileEvents.PICK_IDE_PATH)
  console.log('data: ', data)
  state.icon = data.icon
  state.path = data.path
}
</script>
<template>
  <h1>dashboard</h1>
  <RippleButton @click="test">测试</RippleButton>
  <img v-if="state.icon" :src="state.icon" alt="" />
  <lay-tag v-if="state.path" type="primary">{{ state.path }}</lay-tag>
</template>
<style lang="scss" scoped></style>
