<script lang="ts" setup>
import { getAssetsFile } from '@/utils/getAssetsFile'
import pkg from '../../package.json'

const { system } = useStore()

const cardRef = shallowRef()

const parallax = reactive(useParallax(cardRef))

const cardStyle = computed(() => ({
  transition: '.3s ease-out all',
  transform: `rotateX(${parallax.roll * 20}deg) rotateY(${parallax.tilt * 20}deg)`
}))
</script>

<template>
  <div class="about-wrapper">
    <div ref="cardRef" class="card" :style="cardStyle">
      <img :src="getAssetsFile('logo.png')" alt="" />
    </div>

    <div class="app-info">
      <h1>
        {{ system.appInfo.name }}
      </h1>
      <span>v{{ system.appInfo.version }}</span>
    </div>

    <div class="app-desc">{{ pkg.description }}</div>

    <div class="copy-right">
      <span>Copyright ©2023-present </span>
      <span>{{ pkg.author }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.joway.io/css/Pacifico.css');
.about-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  perspective: 300px;
  .card {
    margin: 40px 0;
    width: 240px;
    height: 280px;
    border-radius: $radius-base;
    @include themeify {
      background: themed('color-bg-aside');
    }
    img {
      width: 240px;
      height: 240px;
    }
  }

  .app-info {
    h1 {
      font-family: 'Pacifico', sans-serif;
    }
    display: flex;
    align-items: flex-end;
    gap: $padding-base;
  }

  .app-desc,
  .copy-right {
    margin-top: $padding-base;
  }
}
</style>
