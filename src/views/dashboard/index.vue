<script lang="ts" setup>
const TodoList = defineAsyncComponent(() => import('./components/TodoList.vue'))
const Calendar = defineAsyncComponent(() => import('./components/Calendar.vue'))
const HotList = defineAsyncComponent(() => import('./components/HotList.vue'))
const MinuteNews = defineAsyncComponent(() => import('./components/MinuteNews.vue'))
</script>
<template>
  <section class="dashboard-wrapper">
    <div class="to-do-list">
      <TodoList />
    </div>
    <div class="calendar">
      <Calendar />
    </div>
    <div class="hot-list">
      <HotList />
    </div>
    <div class="minute-news">
      <MinuteNews />
    </div>
  </section>
</template>
<style lang="scss" scoped>
.dashboard-wrapper {
  height: 100%;
  padding: $padding-mini;
  display: grid;
  grid-template: repeat(5, 1fr) / repeat(2, 1fr);
  gap: $padding-mini;

  > div {
    border-radius: $radius-mini;
    &:hover {
      @include themeify {
        filter: drop-shadow(0px 0px 10px themed('color-shadow'));
      }
    }
    @include themeify {
      background-color: themed('color-bg-aside');
    }
  }

  .to-do-list {
    grid-area: 1/1/3/2;
  }

  .calendar {
    grid-area: 1/2/4/3;
  }

  .hot-list {
    grid-area: 3/1/6/2;
  }

  .minute-news {
    grid-area: 4/2/6/3;
  }
}
</style>
