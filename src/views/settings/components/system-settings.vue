<script setup lang="ts">
import { ipcRenderer } from '@/utils/ipc'
import SettingItem from './setting-item.vue'
import { IPCSystemEvents } from '@shared/config/constant'

const { system, setSystem } = useStore()

const startOnLogin = ref(!!system.value.startOnLogin)

const closeBehavior = ref(system.value.closeBehavior || 'minify')

const updatePolicy = ref(system.value.updatePolicy || 'auto')

function startOnLoginChange() {
  setSystem(startOnLogin.value, 'startOnLogin')
  ipcRenderer.send(IPCSystemEvents.OPEN_APP_ON_START, startOnLogin.value)
}

function closeBehaviorChange(current: string) {
  closeBehavior.value = current
  setSystem(closeBehavior.value, 'closeBehavior')
}

function updatePolicyChange(current: string) {
  updatePolicy.value = current
  setSystem(updatePolicy.value, 'updatePolicy')
}
</script>

<template>
  <SettingItem title="系统配置">
    <lay-form label-position="right" label-width="120px" size="sm">
      <lay-form-item label="开机启动">
        <lay-switch
          v-model="startOnLogin"
          onswitch-text="开启"
          unswitch-text="关闭"
          @change="startOnLoginChange"
        >
        </lay-switch>
      </lay-form-item>

      <lay-form-item label="窗口关闭行为">
        <lay-radio-group v-model="closeBehavior" @change="closeBehaviorChange">
          <lay-radio value="minify"> 最小化 </lay-radio>
          <lay-radio value="close"> 直接关闭 </lay-radio>
        </lay-radio-group>
      </lay-form-item>

      <lay-form-item label="更新方式">
        <lay-radio-group v-model="updatePolicy" @change="updatePolicyChange">
          <lay-radio value="auto"> 自动更新 </lay-radio>
          <lay-radio value="manual"> 手动更新 </lay-radio>
        </lay-radio-group>
      </lay-form-item>
    </lay-form>
  </SettingItem>
</template>
