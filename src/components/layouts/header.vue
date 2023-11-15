<template>
  <header class="layout-header">
    <div class="menu-icon">
      <image-icon link="menu" class="icon" @click="toggleAsideMenu" />
    </div>
    <div class="system-icon">
      <image-icon link="theme" title="主题" class="icon" @click="toggleTheme" />
      <image-icon link="top" title="置顶" class="icon" @click="operateWindow('toggleTop')" />
      <image-icon link="minus" title="最小化" class="icon" @click="operateWindow('minify')" />
      <image-icon link="zoom" title="缩放" class="icon" @click="operateWindow('toggleMaxize')" />
      <image-icon link="close" title="关闭" class="icon" @click="operateWindow('inquire')" />
    </div>

    <Modal v-model="modal" title="关闭提示" @on-ok="confirm">
      <Space direction="vertical" size="large">
        <p>即将退出App？</p>
        <RadioGroup v-model="operation">
          <Radio label="minify">
            <span>最小化</span>
          </Radio>
          <Radio label="close">
            <span>直接退出</span>
          </Radio>
        </RadioGroup>

        <Checkbox v-model="remember">记住选择</Checkbox>
      </Space>
    </Modal>
  </header>
</template>

<script lang="ts" setup>
import { ipcRenderer } from '@/utils/ipc'
import { IPCWindowEvents } from '@shared/config/constant'
import bus from 'vue3-eventbus'
import { useStore } from '@composables/useStore'

defineOptions({
  name: 'LayoutHeader'
})

const { system, setSystem } = useStore()

const modal = ref(false)

const operation = ref('minify')
const remember = ref(false)

function confirm() {
  ipcRenderer.send(IPCWindowEvents.WINDOW_OPERATION, operation.value)
  if (remember.value) {
    setSystem(operation.value, 'closeBehavior')
  }
}

function toggleAsideMenu() {
  bus.emit('toggle-menu')
}

async function operateWindow(type: string) {
  if (type === 'inquire') {
    const behavior = system.value.closeBehavior || 'inquire'
    if (behavior === 'inquire') {
      modal.value = true
      operation.value = 'minify'
      remember.value = false
    } else {
      ipcRenderer.send(IPCWindowEvents.WINDOW_OPERATION, behavior)
    }
  } else {
    ipcRenderer.send(IPCWindowEvents.WINDOW_OPERATION, type)
  }
}

function toggleTheme() {
  const body = document.body
  const theme = body.getAttribute('data-theme')
  const newTheme = theme === 'light' ? 'dark' : 'light'
  body.setAttribute('data-theme', newTheme)
  setSystem(newTheme, 'theme')
}
</script>

<style lang="scss" scoped>
.layout-header {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: $padding-small;

  .menu-icon {
    -webkit-app-region: no-drag;
  }

  .system-icon {
    -webkit-app-region: no-drag;
    display: flex;
    gap: $padding-small;
  }
  .icon {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}
</style>
