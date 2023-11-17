<script lang="ts" setup>
import SystemSettings from './components/system-settings.vue'
import ProjectSettings from './components/project-settings.vue'
import IdeSettings from './components/ide-settings.vue'
const activeTab = ref('base')

const { proxy } = getCurrentInstance()!
function handleTabChange() {
  proxy?.$ScrollIntoView(document.getElementById(activeTab.value), {
    time: 500,
    align: {
      top: 0
    }
  })
}
</script>

<template>
  <div class="setting-wrapper">
    <Tabs v-model="activeTab" @click="handleTabChange">
      <TabPane label="系统配置" name="base"></TabPane>
      <TabPane label="项目配置" name="scan"></TabPane>
      <TabPane label="IDE配置" name="ide"></TabPane>
    </Tabs>
    <div class="setting-content">
      <div id="base">
        <SystemSettings />
      </div>
      <div id="scan">
        <ProjectSettings />
      </div>
      <div id="ide">
        <IdeSettings />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  .setting-content {
    flex: 1;
    overflow: auto;
  }
}
:deep(.ivu-form-item) {
  margin-bottom: 8px;
}
</style>
