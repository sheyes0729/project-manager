<script setup lang="ts">
interface PropsType {
  title: string
}

defineProps<PropsType>()
</script>

<template>
  <header class="content-header">
    <div class="header-bg">
      <div class="bg-block1" />
      <div class="bg-block2" />
      <div class="bg-block3" />
    </div>
    <p class="header-text">{{ title }}</p>
  </header>
  <section class="content-block">
    <slot />
  </section>
</template>

<style lang="scss" scoped>
.content-header {
  --hieght: 24px;
  --width: 260px;
  --start: 24px;
  --bg: var(--global-primary-color);
  height: var(--hieght);
  position: relative;
  user-select: none;
  .header-bg {
    position: position;
    width: 100%;
    .bg-block1 {
      position: absolute;
      width: var(--width);
      height: 100%;
      background-color: var(--bg);
      clip-path: polygon(var(--start) 0, 100% 0, calc(100% - var(--start)) 100%, 0 100%);
    }

    .bg-block2 {
      position: absolute;
      width: 54px;
      height: 100%;
      background-color: var(--bg);
      left: calc(var(--width) - 12px);
      clip-path: polygon(var(--start) 0, 100% 0, calc(100% - var(--start)) 100%, 0 100%);
    }

    .bg-block3 {
      position: absolute;
      width: 54px;
      height: 100%;
      background-color: var(--bg);
      left: calc(var(--width) + 30px);
      clip-path: polygon(var(--start) 0, 100% 0, calc(100% - var(--start)) 100%, 0 100%);
    }
  }

  .header-text {
    position: relative;
    padding-left: var(--start);
    line-height: var(--hieght);
    color: #fff;
    z-index: 10;
  }
}
.content-block {
  padding: $padding-mini $padding-large;
  display: flex;
  flex-direction: column;
  gap: $padding-mini;
}
</style>
