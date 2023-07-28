<template>
  <section ref="menu" class="layout-menu">
    <div ref="menuItemBg" class="menu-item menu-active-bg" />
    <div
      class="menu-item"
      v-for="menu in menuList"
      @click="onMenuSelected(menu)"
      :ref="menuItemRef"
    >
      <image-icon class="icon" :link="menu.icon"></image-icon>
      <div class="title">{{ menu.label }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LayoutMenu'
})

interface MenuItem {
  label: string
  icon: string
  path: string
}

const active = ref('dashboard')

const menuList: Array<MenuItem> = [
  {
    label: 'Dashboard',
    icon: 'menu-dashboard',
    path: 'dashboard'
  },
  {
    label: 'Settings',
    icon: 'menu-settings',
    path: 'settings'
  },
  {
    label: 'About',
    icon: 'menu-about',
    path: 'about'
  }
]

const router = useRouter()
function onMenuSelected(menu: MenuItem) {
  active.value = menu.path
  router.push({
    path: menu.path
  })
}

const menu = shallowRef<HTMLElement>()

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
    const padding = getComputedStyle(item).paddingTop.replace('px', '')
    menuItemBg.value!.style.top = top + Number(padding) / 4 + 'px'
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
.layout-menu {
  position: relative;
  padding-top: $padding-base;
  padding-left: $padding-base;
  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: $padding-small;
    border-radius: $radius-extra-large 0 0 $radius-extra-large;
    cursor: pointer;
    .icon {
      width: 16px;
      height: 16px;
      margin: 0 $padding-mini;
    }

    .label {
      vertical-align: middle;
    }
  }

  .menu-active-bg {
    position: absolute;
    height: calc((100% - 2 * $padding-base) / v-bind('menuList.length'));
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
</style>
