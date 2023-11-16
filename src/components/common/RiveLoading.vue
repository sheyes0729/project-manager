<script setup lang="ts">
import { getAssetsFile } from '@/utils/getAssetsFile'
import { Rive } from '@rive-app/canvas'

const riveCanvas = shallowRef()

let rive: Rive | null = null
onMounted(() => {
  rive = new Rive({
    canvas: riveCanvas.value,
    src: getAssetsFile('rives/loading.riv'),
    autoplay: true
  })
})

onBeforeUnmount(() => {
  rive && rive.stop()
  rive = null
})
</script>

<template>
  <div class="loading-wrapper">
    <canvas ref="riveCanvas" width="400" height="400"></canvas>
  </div>
</template>

<style lang="scss" scoped>
.loading-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
}
</style>
