<script setup lang="ts">
interface PropsType {
  icon?: string
  rippleType?: 'inset' | 'out'
  borderRadiu?: string
  trigger?: 'click' | 'always' | 'mouseenter'
  center?: boolean
  size?: 'lg' | 'sm' | 'xs'
}

withDefaults(defineProps<PropsType>(), {
  rippleType: 'out',
  borderRadiu: '2px',
  trigger: 'always',
  center: false,
  size: 'sm'
})

const emits = defineEmits(['click'])
</script>

<template>
  <lay-ripple :type="rippleType" :border-radius="borderRadiu" :trigger="trigger" :center="center">
    <lay-button v-bind="$attrs" :size="size" :prefix-icon="icon" @click="emits('click')">
      <slot />
    </lay-button>
  </lay-ripple>
</template>
