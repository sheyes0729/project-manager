<script setup lang="ts">
import LayoutHeader from '@/components/layouts/header.vue'
import LayoutAside from '@/components/layouts/aside.vue'

const routeAlive = ref(true)

function reload() {
  routeAlive.value = false
  nextTick(() => {
    routeAlive.value = true
  })
}

provide('app', {
  reload
})
</script>

<template>
  <main class="layout">
    <aside class="left">
      <layout-aside></layout-aside>
    </aside>
    <aside class="right">
      <layout-header></layout-header>
      <section class="content">
        <Suspense>
          <router-view v-if="routeAlive" v-slot="{ Component, route }">
            <keep-alive :max="30">
              <component :is="Component" v-if="route.meta.cache" />
            </keep-alive>
            <component :is="Component" v-if="!route.meta.cache" />
          </router-view>
          <template #fallback>
            <RiveLoading />
          </template>
        </Suspense>
      </section>
    </aside>
  </main>
</template>

<style lang="scss" scoped>
:global(#app) {
  -webkit-app-region: drag;
}

.layout {
  height: 100vh;
  display: flex;
  padding: $padding-small;
  padding-right: 0;
  @include themeify {
    background-color: themed('color-bg');
    color: themed('color-text');
  }
}

.left {
  height: calc(100vh - 2 * $padding-small);
  border-radius: 0 $radius-small $radius-small 0;
  padding: $padding-small 0;
  @include themeify {
    background-color: themed('color-bg-aside');
  }
}

.right {
  flex: 1;
  width: 100%;
  height: 100%;
  padding-left: $padding-base;
  display: flex;
  flex-direction: column;
  gap: $padding-mini;

  .content {
    -webkit-app-region: no-drag;
    height: calc(100% - 24px - 2 * $padding-small);
    width: 100%;
    padding-right: $padding-small;
    overflow: auto;
  }
}
</style>
