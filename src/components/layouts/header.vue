<template>
  <header class="layout-header">
    <div class="menu-icon">
      <lay-space size="md">
        <lay-icon
          v-if="!collapsed"
          style="cursor: pointer; font-size: 18px"
          title="收起"
          type="layui-icon-shrink-right"
          @click="toggleCollapsed"
        />
        <lay-icon
          v-else
          type="layui-icon-spread-left"
          title="展开"
          style="cursor: pointer; font-size: 18px"
          @click="toggleCollapsed"
        />
        <lay-icon
          type="layui-icon-refresh-three"
          title="刷新"
          style="cursor: pointer; font-size: 18px"
          @click="reloadPage"
        />
      </lay-space>
    </div>
    <div class="system-icon">
      <lay-switch v-model="dark" @change="toggleTheme">
        <template #onswitch-icon> 🌛 </template>
        <template #unswitch-icon> ☀ </template>
      </lay-switch>
      <lay-icon
        type="layui-icon-top"
        title="置顶"
        class="icon"
        @click="operateWindow('toggleTop')"
      />
      <lay-icon
        type="layui-icon-subtraction"
        title="最小化"
        class="icon"
        @click="operateWindow('minify')"
      />
      <lay-icon
        type="layui-icon-screen-full"
        title="缩放"
        class="icon"
        @click="operateWindow('toggleMaxize')"
      />
      <lay-icon
        type="layui-icon-addition"
        title="关闭"
        class="icon"
        @click="operateWindow('inquire')"
      />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ipcRenderer } from '@/utils/ipc'
import { IPCWindowEvents } from '@shared/config/constant'

defineOptions({
  name: 'LayoutHeader'
})

const { collapsed, toggleCollapsed, system, setSystem } = useStore()
const dark = ref(system.value.theme === 'dark')

async function operateWindow(type: string) {
  if (type === 'inquire') {
    const behavior = system.value.closeBehavior || 'minify'
    ipcRenderer.send(IPCWindowEvents.WINDOW_OPERATION, behavior)
  } else {
    ipcRenderer.send(IPCWindowEvents.WINDOW_OPERATION, type)
  }
}

function toggleTheme(current: boolean) {
  dark.value = current
  const newTheme = dark.value ? 'dark' : 'light'
  document.body.setAttribute('data-theme', newTheme)
  setSystem(newTheme, 'theme')
}

const app = inject('app') as any
function reloadPage() {
  app?.reload()
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
    align-items: center;
    gap: $padding-base;
  }
  .icon {
    width: 16px;
    height: 16px;
    font-size: $font-large;
    font-weight: $font-weight-bold;
    cursor: pointer;
  }
}
</style>
