<script lang="ts" setup>
import { ipcRenderer } from '@/utils/ipc'
import { IPCFileEvents } from '@shared/config/constant'

const SystemSettings = defineAsyncComponent(() => import('./components/system-settings.vue'))
const ProjectSettings = defineAsyncComponent(() => import('./components/project-settings.vue'))
const IdeSettings = defineAsyncComponent(() => import('./components/ide-settings.vue'))
const TodoSettings = defineAsyncComponent(() => import('./components/todo-settings.vue'))

function openSettingsFile() {
  ipcRenderer.send(IPCFileEvents.OPEN_SETTINGS_FILE)
}
</script>

<template>
  <div class="setting-wrapper">
    <header>
      <RippleButton icon="layui-icon-set" type="normal" @click="openSettingsFile"
        >打开配置文件</RippleButton
      >
    </header>

    <div id="base">
      <SystemSettings />
    </div>
    <div id="scan">
      <ProjectSettings />
    </div>
    <div id="ide">
      <IdeSettings />
    </div>
    <div id="todo">
      <TodoSettings />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-wrapper {
  height: 100%;
  padding: $padding-small $padding-small 0 0;
  display: flex;
  flex-direction: column;
  gap: $padding-small;
  overflow: auto;

  header {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
