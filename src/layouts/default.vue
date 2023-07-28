<script setup lang="ts">
import LayoutHeader from '@/components/layouts/header.vue'
import LayoutMenu from '@/components/layouts/menu.vue'
</script>

<template>
  <Row class="layout-row">
    <Col span="5">
      <aside class="left">
        <div class="logo">
          <svg-icon name="logo" :cursor="false" width="80px" height="80px"></svg-icon>
        </div>
        <div class="menu">
          <layout-menu></layout-menu>
        </div>
      </aside>
    </Col>
    <Col span="19">
      <aside class="right">
        <layout-header></layout-header>
        <section class="content">
          <router-view v-slot="{ Component, route }">
            <keep-alive :max="30">
              <component :is="Component" v-if="route.meta.cache" />
            </keep-alive>
            <component :is="Component" v-if="!route.meta.cache" />
          </router-view>
        </section>
      </aside>
    </Col>
  </Row>
</template>

<style lang="scss" scoped>
:global(#app) {
  -webkit-app-region: drag;
}

.layout-row {
  height: 100vh;
  padding: $padding-small;
  @include themeify {
    background-color: themed('color-bg');
  }
}

.left {
  height: calc(100vh - 2 * $padding-small);
  border-radius: $radius-small;
  padding: $padding-small 0;
  display: flex;
  flex-direction: column;
  gap: $padding-mini;
  @include themeify {
    background-color: themed('color-bg-aside');
  }

  .logo {
    display: grid;
    place-content: center;
  }

  .menu {
    -webkit-app-region: no-drag;
    flex: 1;
    overflow: auto;
  }
}

.right {
  height: 100%;
  padding-left: $padding-base;
  display: flex;
  flex-direction: column;
  gap: $padding-mini;

  .content {
    -webkit-app-region: no-drag;
    flex: 1;
  }
}
</style>
