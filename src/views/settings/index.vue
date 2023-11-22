<script lang="ts" setup>
const SystemSettings = defineAsyncComponent(() => import('./components/system-settings.vue'))
const ProjectSettings = defineAsyncComponent(() => import('./components/project-settings.vue'))
const IdeSettings = defineAsyncComponent(() => import('./components/ide-settings.vue'))
const TodoSettings = defineAsyncComponent(() => import('./components/todo-settings.vue'))
</script>

<template>
  <div class="setting-wrapper">
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
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
