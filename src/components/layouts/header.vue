<template>
  <header class="layout-header">
    <div class="menu-icon">
      <image-icon link="menu" class="icon" />
    </div>
    <div class="system-icon">
      <image-icon link="minus" class="icon" />
      <image-icon link="zoom" class="icon" />
      <image-icon link="close" class="icon" />
    </div>
  </header>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'LayoutHeader'
})
</script>

<style lang="scss" scoped>
.layout-header {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .menu-icon {
    -webkit-app-region: no-drag;
  }

  .system-icon {
    -webkit-app-region: no-drag;
    display: flex;
    gap: $padding-small;
  }
  .icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}
</style>
