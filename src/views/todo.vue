<script lang="ts" setup>
import { Qalendar } from 'qalendar'
import 'qalendar/dist/style.css'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)

const config = reactive({
  week: {
    // Takes the value 'sunday' or 'monday'
    // However, if startsOn is set to 'sunday' and nDays to 5, the week displayed will be Monday - Friday
    startsOn: 'monday',
    // Takes the values 5 or 7.
    nDays: 7,
    // Scroll to a certain hour on mounting a week. Takes any value from 0 to 23.
    // This option is not compatible with the 'dayBoundaries'-option, and will simply be ignored if custom day boundaries are set.
    scrollToHour: 5
  },
  month: {
    // Hide leading and trailing dates in the month view (defaults to true when not set)
    showTrailingAndLeadingDates: false
  },
  // Takes any valid locale that the browser understands. However, not all locales have been thorougly tested in Qalendar
  // If no locale is set, the preferred browser locale will be used
  locale: 'zh-CN',
  style: {
    // When adding a custom font, please also set the fallback(s) yourself
    fontFamily: `'Poppins', sans-serif`
  },
  // if not set, the mode defaults to 'week'. The three available options are 'month', 'week' and 'day'
  // Please note, that only day and month modes are available for the calendar in mobile-sized wrappers (~700px wide or less, depending on your root font-size)
  defaultMode: 'month',
  // The silent flag can be added, to disable the development warnings. This will also bring a slight performance boost
  isSilent: true,
  showCurrentTime: true // Display a line indicating the current time
})

const events = reactive([
  {
    title: 'Meeting with Dora',
    with: 'Albert Einstein',
    time: { start: '2023-11-18 04:52', end: '2023-11-21 05:37' },
    color: 'green',
    isEditable: true,
    id: 'de471c78cb5c',
    description:
      "Think of me as Yoda. Only instead of being little and green, I wear suites and I'm awesome."
  },
  {
    title: 'Advanced algebra',
    with: 'Pheobe Buffay',
    time: { start: '2023-11-12 20:05', end: '2023-11-16 21:35' },
    colorScheme: 'sports',
    isEditable: true,
    id: '6d3c0980a5cf',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!'
  },
  {
    title: 'Break',
    with: 'Marshall Eriksen',
    time: { start: '2023-11-10 22:10', end: '2023-11-12 22:55' },
    colorScheme: 'meetings',
    isEditable: true,
    id: '9f1b209982f1',
    location: 'Zoom'
  },
  {
    title: 'Break',
    with: 'Marshall Eriksen',
    time: { start: '2023-11-21 22:10', end: '2023-11-21 22:55' },
    colorScheme: 'meetings',
    isEditable: true,
    id: '9f1b209982f1',
    location: 'Zoom'
  }
])

const { system } = useStore()
const theme = computed(() => system.value.theme)

const dialogVisible = ref(false)

function defaultForm() {
  return {
    id: nanoid(),
    title: '',
    with: '',
    topic: '',
    time: { start: null, end: null },
    description: '',
    location: '',
    color: '',
    colorSchema: ''
  }
}

const form = ref(defaultForm())

function handleClickEvent(data) {
  console.log('click: ', data)
}

function handleEditEvent(data) {
  console.log('edit: ', data)
  dialogVisible.value = true
}

function handleDeleteEvent(...args) {
  console.log('delete: ', ...args)
}

function handleDatetimeClick(...args) {
  console.log('handleDatetimeClick: ', ...args)
}

function handleDateClick(...args) {
  console.log('handleDateClick: ', ...args)
}

function handleDragedEvent(...args) {
  console.log('handleDragedEvent: ', ...args)
}

function handleIntervalClick(...args) {
  console.log('handleIntervalClick: ', ...args)
}
</script>
<template>
  <div class="todo-wrapper" :style="{ colorScheme: theme }">
    <Qalendar
      :config="config"
      :events="events"
      @event-was-clicked="handleClickEvent"
      @edit-event="handleEditEvent"
      @delete-event="handleDeleteEvent"
      @datetime-was-clicked="handleDatetimeClick"
      @date-was-clicked="handleDateClick"
      @event-was-dragged="handleDragedEvent"
      @interval-was-clicked="handleIntervalClick"
    />
    <el-dialog v-model="dialogVisible" title="待办" width="45%" append-to-body>
      <lay-form :model="form">
        <lay-form-item label="id">
          <lay-input v-model="form.id" disabled />
        </lay-form-item>
        <lay-form-item label="标题" prop="title">
          <lay-input v-model="form.title" />
        </lay-form-item>
        <lay-form-item label="主题" prop="topic">
          <lay-input v-model="form.topic" />
        </lay-form-item>
        <lay-form-item label="时间" prop="time">
          <lay-input />
        </lay-form-item>
        <lay-form-item label="详情" prop="description">
          <lay-input v-model="form.description" />
        </lay-form-item>
        <lay-form-item label="标签">
          <lay-input v-model="form.color" />
        </lay-form-item>
        <lay-form-item label="地点">
          <lay-input v-model="form.location" />
        </lay-form-item>
      </lay-form>
      <template #footer>
        <lay-space>
          <lay-button size="sm" @click="dialogVisible = false">取消</lay-button>
          <lay-button type="primary" size="sm">确定</lay-button>
        </lay-space>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.todo-wrapper {
  height: 100%;
}
</style>
