<script lang="ts" setup>
import dayjs from 'dayjs'

const { todo } = useStore()

const today = dayjs().format('YYYY-MM-DD')

const todoList = computed(() => {
  return (todo.value.list ?? []).filter((td) => {
    return (
      dayjs(td.time.start).format('YYYY-MM-DD') === today ||
      dayjs(td.time.end).format('YYYY-MM-DD') === today
    )
  })
})

const bgMap = new Map<string, string>()
function getBgColor(scheme: string) {
  if (bgMap.has(scheme)) return bgMap.get(scheme)
  let bg = ''
  const sche = (todo.value.tagList ?? []).find((tag) => tag.title == scheme)
  if (sche) bg = sche.backgroundColor
  bgMap.set(scheme, bg)
  return bg
}
</script>

<template>
  <div class="todo-list-wrapper">
    <header class="todo-list-header">
      <div>今日待办</div>
    </header>

    <ul class="todo-list-content">
      <li v-for="td in todoList">
        <div
          class="marker"
          :style="{ backgroundColor: getBgColor(td.colorScheme) || 'var(--global-primary-color)' }"
        />
        <div class="title">{{ td.title }}</div>
        <div class="time">{{ `${td.time.start} - ${td.time.end}` }}</div>
      </li>

      <lay-empty v-if="!todoList.length" description="暂无待办" />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.todo-list-wrapper {
  height: 100%;
  padding: $padding-mini;
  display: flex;
  flex-direction: column;

  .todo-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font-small;
    .layui-icon {
      cursor: pointer;
    }
  }

  .todo-list-content {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding: $padding-mini 0;
    li {
      position: relative;
      height: 32px;
      display: flex;
      align-items: center;
      margin-bottom: $padding-small;
      padding-right: $padding-mini;
      border-radius: 0 $radius-mini $radius-mini 0;
      @include themeify {
        background-color: themed('color-bg');
      }
      .marker {
        position: absolute;
        width: 8px;
        height: inherit;
      }

      .title {
        flex: 1;
        font-family: 'Poppins', sans-serif;
        font-size: $font-small;
        font-weight: $font-weight-bold;
        padding: 0 $padding-small;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .time {
        font-size: $font-mini;
      }
    }
  }
}
</style>
