<template>
  <svg :style="{ width, height, cursor: cursor ? 'pointer' : 'auto' }">
    <use :xlink:href="prefix + '-' + name" :fill="color"></use>
  </svg>
</template>
<script setup>
defineOptions({
  name: 'SvgIcon'
})

defineProps({
  prefix: {
    type: String,
    default: '#icon'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#333'
  },
  width: {
    type: String,
    default: '24px'
  },
  height: {
    type: String,
    default: '24px'
  },
  cursor: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped></style>
