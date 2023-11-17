<script setup lang="ts">
import SettingItem from './setting-item.vue'

const defaultEditor = ref(null)

const cityList = [
  {
    label: '重庆',
    value: 'cq'
  },
  {
    label: '四川',
    value: 'sc'
  },
  {
    label: '贵州',
    value: 'gz'
  },
  {
    label: '云南',
    value: 'yn'
  }
]
</script>

<template>
  <SettingItem title="编辑器配置">
    <Form label-position="right" :label-width="120">
      <Form-item label="编辑器管理">
        <Button type="primary" size="small">添加编辑器</Button>
      </Form-item>

      <Form-item label="默认编辑器">
        <Space>
          <Select v-model="defaultEditor" style="width: 200px" clearable filterable>
            <Option v-for="item in cityList" :key="item.value" :value="item.value">{{
              item.label
            }}</Option>
          </Select>
          <Tooltip content="未绑定编辑器的项目默认用此打开">
            <Icon type="ios-alert" />
          </Tooltip>
        </Space>
      </Form-item>
    </Form>
  </SettingItem>
</template>
