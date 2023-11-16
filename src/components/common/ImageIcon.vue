<template>
  <img :class="props.class" :src="imageSrc" :style="imageStyle" :title="title" :alt="alt" />
</template>

<script lang="ts" setup>
import { getAssetsFile } from '@/utils/getAssetsFile'
import { StyleValue } from 'vue'
defineOptions({
  name: 'ImageIcon'
})

interface PropType {
  link: string
  remote?: boolean
  type?: 'png' | 'jpg' | 'svg'
  width?: string
  height?: string
  cursor?: boolean
  alt?: string
  title?: string
  class?: string
}

const props = withDefaults(defineProps<PropType>(), {
  remote: false,
  width: '24px',
  height: '24px',
  cursor: false,
  type: 'png',
  alt: '',
  title: '',
  class: ''
})

const imageStyle = computed(() => {
  if (props.class) {
    return {}
  }
  return {
    display: 'block',
    objectFit: 'fill',
    cursor: props.cursor ? 'pointer' : 'auto',
    width: props.width,
    height: props.height
  } as StyleValue
})

const imageSrc = computed(() => {
  let src = ''
  if (props.remote) {
    src = props.link
  } else {
    const arr = props.link.split('-')
    let prefix = 'images'
    arr.forEach((path) => {
      prefix += '/' + path
    })
    src = getAssetsFile(prefix + '.' + props.type)
  }
  return src
})
</script>

<style lang="scss" scoped>
img {
  @include themeify {
    filter: themed('img-filter');
  }
}
</style>
