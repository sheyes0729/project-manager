<script lang="ts" setup>
import { getAssetsFile } from '@/utils/getAssetsFile'
import pkg from '../../package.json'
import { ipcRenderer } from '@/utils/ipc'
import { IPCUpdateEvents } from '@shared/config/constant'
import { UpdateMessage } from '@shared/typings/update'

const { system } = useStore()

const cardRef = shallowRef()

const parallax = reactive(useParallax(cardRef))

const cardStyle = computed(() => ({
  transition: '.3s ease-out all',
  transform: `rotateX(${parallax.roll * 20}deg) rotateY(${parallax.tilt * 20}deg)`
}))

const status = ref('')
const progress = ref(0)
function checkUpdate() {
  ipcRenderer.send(IPCUpdateEvents.CHECK_UPDATE)

  ipcRenderer.once(IPCUpdateEvents.UPDATE_MESSAGE, (_, data) => {
    console.log('update message: ', data)
    switch (data.status) {
      case UpdateMessage.available:
        status.value = '有可用更新'
        break

      case UpdateMessage.notAvailable:
        status.value = '暂无更新'
        break

      case UpdateMessage.updating:
        progress.value = data.progress.percent
        console.log('总计大小：', transform2MB(data.progress.total))
        console.log('已下载：', transform2MB(data.progress.transferred))
        console.log('下载速度：', transform2MB(data.progress.bytesPerSecond))
        break

      case UpdateMessage.completed:
        console.log('更新完成')
        progress.value = 100
        break
    }
  })
}

// function update(): void {
//   ipcRenderer.send(IPCUpdateEvents.UPDATE_DOWNLOAD)
// }

// function install(): void {
//   ipcRenderer.send(IPCUpdateEvents.INSTALL_UPDATE)
// }

function transform2MB(value: number): number {
  return Math.ceil(value / 1024 / 1024)
}
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
      <RippleButton @click="checkUpdate">检查更新</RippleButton>
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
  gap: $padding-large;
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

  .app-desc {
    width: 50%;
    text-align: center;
  }
}
</style>
