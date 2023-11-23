<script setup lang="ts">
const { system, setSystem } = useStore()
const dark = ref(system.value.theme === 'dark')

function toggleTheme(current: boolean) {
  dark.value = current
  const newTheme = dark.value ? 'dark' : 'light'
  document.body.setAttribute('data-theme', newTheme)
  setSystem(newTheme, 'theme')
}
</script>

<template>
  <lay-switch v-model="dark" @change="toggleTheme">
    <template #onswitch-icon> 🌛 </template>
    <template #unswitch-icon> ☀ </template>
  </lay-switch>
</template>

<script lang="scss" scopde></script>
