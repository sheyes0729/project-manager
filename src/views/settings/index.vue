<template>
  <div class="setting-wrapper">
    <Tabs v-model="activeTab" @click="handleTabChange">
      <TabPane label="系统配置" name="base"></TabPane>
      <TabPane label="文件配置" name="scan"></TabPane>
      <TabPane label="IDE配置" name="ide"></TabPane>
    </Tabs>
    <div class="setting-content">
      <div id="base" style="height: 500px">
        <SettingItem title="系统配置">
          <p>开机启动</p>
          <p>窗口关闭方式</p>
        </SettingItem>
      </div>
      <div id="scan" style="height: 500px">
        <SettingItem title="文件配置">
          <p>文件绑定</p>
          <p>扫描策略：覆盖 / 合并</p>
          <p>分组管理</p>
          <p>展示管理</p>
        </SettingItem>
      </div>
      <div id="ide" style="height: 500px">
        <SettingItem title="IDE配置">
          <p>添加ide vscode / idea</p>
        </SettingItem>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SettingItem from './components/setting-item.vue'
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
