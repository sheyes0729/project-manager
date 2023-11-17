<script setup lang="ts">
import { ipcRenderer } from '@/utils/ipc'
import SettingItem from './setting-item.vue'
import { IPCSystemEvents } from '@shared/config/constant'

const { system, setSystem } = useStore()

const startOnLogin = ref(system.value.startOnLogin || 0)

const closeBehavior = ref(system.value.closeBehavior || 'minify')

const updatePolicy = ref(system.value.updatePolicy || 'auto')

function startOnLoginChange() {
  setSystem(startOnLogin.value, 'startOnLogin')
  ipcRenderer.send(IPCSystemEvents.OPEN_APP_ON_START, !!startOnLogin.value)
}

function closeBehaviorChange() {
  setSystem(closeBehavior.value, 'closeBehavior')
}

function updatePolicyChange() {
  setSystem(updatePolicy.value, 'updatePolicy')
}
</script>

<template>
  <SettingItem title="系统配置">
    <Form label-position="right" :label-width="120">
      <FormItem label="开机启动">
        <RadioGroup v-model="startOnLogin" @change="startOnLoginChange">
          <Radio :label="1">
            <span>是</span>
          </Radio>
          <Radio :label="0">
            <span>否</span>
          </Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="窗口关闭行为">
        <RadioGroup v-model="closeBehavior" @change="closeBehaviorChange">
          <Radio label="minify">
            <span>最小化</span>
          </Radio>
          <Radio label="close">
            <span>直接关闭</span>
          </Radio>
        </RadioGroup>
      </FormItem>

      <Form-Item label="更新方式">
        <RadioGroup v-model="updatePolicy" @change="updatePolicyChange">
          <Radio label="auto">
            <span>自动更新</span>
          </Radio>
          <Radio label="manual">
            <span>手动更新</span>
          </Radio>
        </RadioGroup>
      </Form-Item>
    </Form>
  </SettingItem>
</template>
