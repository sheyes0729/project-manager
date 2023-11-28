<script lang="ts" setup></script>

<template>
  <div class="news-wrapper">
    <header>
      <div>今日新闻</div>
    </header>
    <secton class="news-content">
      <img src="https://api.52vmy.cn/api/wl/60s" />
    </secton>
  </div>
</template>

<style lang="scss" scoped>
.news-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: $padding-mini;
  gap: $padding-mini;
  font-size: $font-small;

  .news-content {
    flex: 1;
    overflow-y: auto;
    img {
      width: 100%;
      border-radius: $radius-mini;
    }
  }
}
</style>
