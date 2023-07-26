<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :max="30">
      <component :is="Component" v-if="route.meta.cache" />
    </keep-alive>
    <component :is="Component" v-if="!route.meta.cache" />
  </router-view>
</template>

<style lang="scss"></style>
