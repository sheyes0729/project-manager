<script setup lang="ts">
import SettingItem from './setting-item.vue'

const { system, setSystem } = useStore()

const scanCategory = ref(system.value.scanCategory || 'cover')

const displayMode = ref(system.value.displayMode || 'list')

function scanCategoryChange() {
  setSystem(scanCategory.value, 'scanCategory')
}

function displayModeChange() {
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
    <Form :label-width="120" label-position="right">
      <Form-Item label="类型绑定">
        <Button type="primary" icon="ios-add" size="small">添加类型</Button>
      </Form-Item>
      <Form-Item label="扫描策略">
        <RadioGroup v-model="scanCategory" @change="scanCategoryChange">
          <Radio label="cover">
            <span>覆盖</span>
          </Radio>
          <Radio label="merge">
            <span>合并</span>
          </Radio>
        </RadioGroup>
      </Form-Item>
      <Form-Item label="分组管理">
        <Button type="primary" icon="ios-add" size="small">添加分组</Button>
      </Form-Item>
      <Form-Item label="展示方式">
        <RadioGroup v-model="displayMode" @change="displayModeChange">
          <Radio label="list">
            <span>列表</span>
          </Radio>
          <Radio label="group">
            <span>分组</span>
          </Radio>
        </RadioGroup>
      </Form-Item>
    </Form>
  </SettingItem>
</template>
