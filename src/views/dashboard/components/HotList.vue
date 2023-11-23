<script lang="ts" setup>
import { ipcRenderer } from '@/utils/ipc'
import { IPCSystemEvents } from '@shared/config/constant'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const tabList = [
  {
    label: '知乎',
    name: 'zhihu'
  },
  {
    label: '百度',
    name: 'baidu'
  },
  {
    label: 'b站',
    name: 'bilihot'
  },
  {
    label: '微博',
    name: 'weibo'
  },
  {
    label: '抖音',
    name: 'douyin'
  },
  {
    label: '少数派',
    name: 'sspai'
  }
]

const cacheMap = new Map<string, any>()
const activeTab = ref('zhihu')
const list = ref<any[]>([])
const loading = ref(false)

function handleTabChange() {
  fetchData()
}

async function fetchData(refresh = false) {
  try {
    loading.value = true
    if (!refresh && cacheMap.has(activeTab.value)) {
      list.value = cacheMap.get(activeTab.value)
    } else {
      const res = await fetch(
        `https://www.zhiyanx.cn/api/hotlist/index.php?type=${activeTab.value}`
      )
      const data = await res.json()
      list.value = data.data
      cacheMap.set(activeTab.value, data.data)
    }
  } catch (e) {
    console.log('fetch error: ', e)
  } finally {
    loading.value = false
  }
}

function openUrl(url: string) {
  ipcRenderer.send(IPCSystemEvents.OPEN_URL_EXTERNAL, url)
}

onBeforeMount(() => {
  fetchData()
})
</script>

<template>
  <DefineTemplate>
    <div class="hot-content">
      <ul v-if="list && list.length">
        <li v-for="hot in list" class="hot-item">
          <div class="hot-index">{{ hot.index }}</div>
          <div class="hot-title" @click="openUrl(hot.url)">{{ hot.title }}</div>
          <div class="hot-number">{{ hot.hot }}</div>
        </li>
      </ul>
      <lay-empty v-else description="暂无数据">
        <template #extra>
          <RippleButton @click="fetchData(true)">刷新试试</RippleButton>
        </template>
      </lay-empty>
    </div>
  </DefineTemplate>
  <div class="hot-list-wrapper">
    <header class="hl-header">
      <div>
        <SvgIcon name="fire" width="14px" height="14px" :cursor="false" />
        <span> 热搜榜</span>
      </div>
      <lay-icon type="layui-icon-refresh" class="icon" @click="fetchData(true)" />
    </header>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      ></el-tab-pane>
    </el-tabs>

    <lay-loading :loading="loading">
      <ReuseTemplate />
    </lay-loading>
  </div>
</template>

<style lang="scss" scoped>
.hot-list-wrapper {
  height: 100%;
  --el-color-primary: var(--global-primary-color);
  padding: $padding-mini;
  display: flex;
  flex-direction: column;
  .hl-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font-small;

    .icon {
      cursor: pointer;
      font-size: $font-base;
    }
  }

  :deep(.layui-loading) {
    flex: 1;
    overflow-y: auto;
  }

  .hot-content {
    .hot-item {
      display: flex;
      width: 100%;
      padding: $padding-mini 0;

      .hot-index {
        padding-left: $padding-base;
        width: 60px;
        font-size: $font-large;
      }

      .hot-title {
        flex: 1;
        font-size: $font-small;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }

      .hot-number {
        width: 60px;
        text-align: end;
        font-size: $font-base;
      }
    }
  }
}
</style>
