<template>
  <section :class="['layout-aside', { toggled: collapsed }]">
    <div class="logo">
      <img v-if="!collapsed" :src="getAssetsFile('logo-with-title.png')" />
      <img v-else :src="getAssetsFile('logo.png')" />
    </div>
    <div class="menu">
      <div ref="menuItemBg" class="menu-item menu-active-bg" />
      <div v-for="m in menuList" :ref="menuItemRef" class="menu-item" @click="onMenuSelected(m)">
        <!-- <image-icon class="icon" :link="m.icon"></image-icon> -->
        <lay-icon class="icon" :type="m.icon"></lay-icon>
        <div class="label">{{ m.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getAssetsFile } from '@/utils/getAssetsFile'

defineOptions({
  name: 'LayoutAside'
})

const { collapsed } = useStore()

interface MenuItem {
  label: string
  icon: string
  path: string
}

const active = ref('dashboard')

const menuList: Array<MenuItem> = [
  {
    label: '总览',
    icon: 'layui-icon-app',
    path: 'dashboard'
  },
  {
    label: '待办',
    icon: 'layui-icon-date',
    path: 'todo'
  },
  {
    label: '项目',
    icon: 'layui-icon-layouts',
    path: 'file'
  },
  {
    label: 'Node',
    icon: 'layui-icon-code-circle',
    path: 'node'
  },
  {
    label: '设置',
    icon: 'layui-icon-set',
    path: 'settings'
  },
  {
    label: '关于',
    icon: 'layui-icon-about',
    path: 'about'
  }
]

watch(collapsed, () => {
  const index = menuList.findIndex((menu: MenuItem) => menu.path === active.value)
  handleBgMove(index)
})

const router = useRouter()
function onMenuSelected(menu: MenuItem) {
  active.value = menu.path
  router.push({
    path: menu.path
  })
}

const menuItem = shallowRef<Array<HTMLElement>>([])

const menuItemRef = (el) => {
  menuItem.value.push(el)
}

onBeforeUpdate(() => {
  menuItem.value = []
})

const menuItemBg = shallowRef<HTMLElement>()

function handleBgMove(index: number) {
  nextTick(() => {
    const item = menuItem.value[index]
    const top = item.offsetTop
    const height = item.clientHeight
    menuItemBg.value!.style.height = height + 'px'
    menuItemBg.value!.style.top = top + 'px'
  })
}

watch(
  active,
  (value: string) => {
    const index = menuList.findIndex((menu: MenuItem) => menu.path === value)
    handleBgMove(index)
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.layout-aside {
  height: 100%;
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: $padding-mini;
  transition: width 0.3s ease;

  .logo {
    display: flex;
    align-items: center;
    padding: 0 $padding-large;
    gap: $padding-base;
    height: 72px;
    overflow: hidden;

    img {
      width: 257px;
      height: 167px;
      margin-left: -35px;
    }
  }
}

.menu {
  flex: 1;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  position: relative;
  padding-top: $padding-base;
  padding-left: $padding-base;
  .menu-item {
    -webkit-app-region: no-drag;
    position: relative;
    display: flex;
    align-items: center;
    padding: $padding-small;
    border-radius: $radius-extra-large 0 0 $radius-extra-large;
    cursor: pointer;
    white-space: nowrap;
    .icon {
      font-size: $font-large;
      margin: 0 $padding-mini;
    }

    .label {
      vertical-align: middle;
    }
  }

  .menu-active-bg {
    position: absolute;
    width: calc(100% - $padding-base);
    transition: top 0.3s ease;
    @include themeify {
      background-color: themed('color-bg');
    }
    &::before {
      position: absolute;
      top: -1 * $padding-base;
      right: 0;
      content: '';
      width: $padding-base;
      height: $padding-base;
      @include themeify {
        background: radial-gradient(
          circle at 0 0,
          transparent $padding-base,
          themed('color-bg') $padding-base
        );
      }
    }

    &::after {
      position: absolute;
      bottom: -1 * $padding-base;
      right: 0;
      content: '';
      width: $padding-base;
      height: $padding-base;
      @include themeify {
        background: radial-gradient(
          circle at 0 $padding-base,
          transparent $padding-base,
          themed('color-bg') $padding-base
        );
      }
    }
  }
}

.layout-aside.toggled {
  width: 80px;
  .logo {
    img {
      width: 40px;
      height: 40px;
      margin: 0;
    }
  }
  .menu-item {
    .label {
      display: none;
    }
  }
}
</style>
