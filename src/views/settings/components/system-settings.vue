<script setup lang="ts">
import { ipcRenderer } from '@/utils/ipc'
import SettingItem from './setting-item.vue'
import { IPCSystemEvents } from '@shared/config/constant'

const { system, setSystem } = useStore()

const startOnLogin = ref(system.value.startOnLogin || 0)

const closeBehavior = ref(system.value.closeBehavior || 'minify')

function startOnLoginChange() {
  setSystem(startOnLogin.value, 'startOnLogin')
  ipcRenderer.send(IPCSystemEvents.OPEN_APP_ON_START, !!startOnLogin.value)
}

function closeBehaviorChange() {
  setSystem(closeBehavior.value, 'closeBehavior')
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
    </Form>
  </SettingItem>
</template>
