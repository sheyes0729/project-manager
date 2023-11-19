<script lang="ts" setup>
import { ElTabs, ElTabPane } from 'element-plus'
import 'element-plus/es/components/tabs/style/css'
import 'element-plus/es/components/tab-pane/style/css'

const cacheSet = new Map<string, any>()
const activeTab = ref('zhihu')
const list = ref<any[]>([])

function handleTabClick() {
  console.log(activeTab.value)
}

async function fetchData() {
  try {
    if (cacheSet.has(activeTab.value)) {
      list.value = cacheSet.get(activeTab.value)
      return
    }
    const res = await fetch(`https://www.zhiyanx.cn/api/hotlist/index.php?type=${activeTab.value}`)
    const data = await res.json()
    list.value = data.data
    console.log(data)
  } catch (e) {
    console.log('fetch error: ', e)
  }
}

onBeforeMount(() => {
  fetchData()
})
</script>

<template>
  <div class="hot-list-wrapper">
    <header class="hl-header">
      <div>
        <SvgIcon name="fire" width="14px" height="14px" :cursor="false" />
        <span> 热搜榜</span>
      </div>
      <lay-icon type="layui-icon-refresh" class="icon" />
    </header>

    <div class="hl-content">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="知乎" name="zhihu">知乎热搜</el-tab-pane>
        <el-tab-pane label="百度" name="baidu">百度热搜</el-tab-pane>
        <el-tab-pane label="b站" name="bilihot">b站热搜</el-tab-pane>
        <el-tab-pane label="微博" name="weibo">微博热搜</el-tab-pane>
        <el-tab-pane label="今日头条" name="toutiao">头条热搜</el-tab-pane>
        <el-tab-pane label="少数派" name="sspai">少数派热搜</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hot-list-wrapper {
  --el-color-primary: var(--global-primary-color);
  padding: $padding-mini;
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

  .hl-content {
    width: 100%;
    overflow-y: auto;
  }
}
</style>
