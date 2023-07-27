<template>
  <svg :style="{ width, height, cursor: cursor ? 'pointer' : 'auto' }">
    <use :xlink:href="prefix + '-' + name" :fill="color"></use>
  </svg>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'SvgIcon'
})

interface PropsType {
  prefix?: string
  name: string
  color?: string
  width?: string
  height?: string
  cursor?: boolean
}

withDefaults(defineProps<PropsType>(), {
  prefix: '#icon',
  color: '#333333',
  width: '24px',
  height: '24px',
  cursor: true
})
</script>

<style lang="scss" scoped></style>
