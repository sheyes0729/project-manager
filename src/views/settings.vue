<template>
  <div class="setting-wrapper">
    <Tabs v-model="activeTab" @click="handleTabChange">
      <TabPane label="系统配置" name="base"></TabPane>
      <TabPane label="扫描配置" name="scan"></TabPane>
      <TabPane label="IDE配置" name="ide"></TabPane>
    </Tabs>
    <div class="setting-content">
      <div id="base" style="height: 500px">开机启动</div>
      <div id="scan" style="height: 500px">扫描策略：覆盖 / 合并</div>
      <div id="ide" style="height: 500px">vscode / idea</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
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
</style>
