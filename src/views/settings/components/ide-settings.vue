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
    <lay-form label-position="right" label-width="120px" size="sm">
      <lay-form-item label="编辑器管理">
        <RippleButton type="primary" icon="layui-icon-addition">添加编辑器</RippleButton>
      </lay-form-item>

      <lay-form-item label="默认编辑器">
        <lay-space>
          <lay-select v-model="defaultEditor" style="width: 200px" clearable filterable>
            <lay-select-option
              v-for="item in cityList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></lay-select-option>
          </lay-select>
          <lay-tooltip content="未绑定编辑器的项目默认用此打开" trigger="hover">
            <lay-icon type="layui-icon-help-circle" />
          </lay-tooltip>
        </lay-space>
      </lay-form-item>
    </lay-form>
  </SettingItem>
</template>
