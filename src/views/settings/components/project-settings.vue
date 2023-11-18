<script setup lang="ts">
const SettingItem = defineAsyncComponent(() => import('./setting-item.vue'))

const { system, setSystem } = useStore()

const scanCategory = ref(system.value.scanCategory || 'cover')

const displayMode = ref(system.value.displayMode || 'list')

function scanCategoryChange(current: string) {
  scanCategory.value = current
  setSystem(scanCategory.value, 'scanCategory')
}

function displayModeChange(current: string) {
  displayMode.value = current
  setSystem(displayMode.value, 'displayMode')
}
// const obj = {
//   name: 'NODE',
//   icon: '',
//   include: [],
//   exclude: [],
//   ide: ""
// }
</script>

<template>
  <SettingItem title="项目配置">
    <lay-form label-width="120px" label-position="right" size="sm">
      <lay-form-item label="类型绑定">
        <RippleButton type="primary" icon="layui-icon-addition">添加类型</RippleButton>
      </lay-form-item>
      <lay-form-item label="扫描策略">
        <lay-radio-group v-model="scanCategory" @change="scanCategoryChange">
          <lay-radio value="cover"> 覆盖 </lay-radio>
          <lay-radio value="merge"> 合并 </lay-radio>
        </lay-radio-group>
      </lay-form-item>
      <lay-form-item label="分组管理">
        <RippleButton type="primary" icon="layui-icon-addition">添加分组</RippleButton>
      </lay-form-item>
      <lay-form-item label="展示方式">
        <lay-radio-group v-model="displayMode" @change="displayModeChange">
          <lay-radio value="list"> 列表 </lay-radio>
          <lay-radio value="group"> 分组 </lay-radio>
        </lay-radio-group>
      </lay-form-item>
    </lay-form>
  </SettingItem>
</template>
