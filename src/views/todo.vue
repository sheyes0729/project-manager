<script lang="ts" setup>
import { Qalendar } from '@/plugins/qalendar/qalendar.es'
import '@/plugins/qalendar/style.css'
import { cloneDeep } from 'lodash'
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
  // style: {
  //   // When adding a custom font, please also set the fallback(s) yourself
  //   fontFamily: `'Poppins', sans-serif`
  // },
  // if not set, the mode defaults to 'week'. The three available options are 'month', 'week' and 'day'
  // Please note, that only day and month modes are available for the calendar in mobile-sized wrappers (~700px wide or less, depending on your root font-size)
  defaultMode: 'month',
  // The silent flag can be added, to disable the development warnings. This will also bring a slight performance boost
  // isSilent: true,
  showCurrentTime: true // Display a line indicating the current time
})

const events = ref([
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

const title = ref('')
const dialogVisible = ref(false)

interface TodoItem {
  id: string
  title: string
  with?: string
  topic?: string
  time: { start: string; end: string }
  location?: string
  colorSchema?: string
  color?: string
  description?: string
  isEditable: boolean
}

interface TodoForm extends Omit<TodoItem, 'time'> {
  time: any[]
}

function defaultForm() {
  return {
    id: nanoid(),
    title: '',
    with: '',
    topic: '',
    time: [],
    description: '',
    location: '',
    colorSchema: '',
    isEditable: true
  } as TodoForm
}

const form = ref<TodoForm>(defaultForm())

const rules = ref({
  title: {
    required: true,
    message: '标题不能为空'
  }
})

function handleClickEvent(data) {
  console.log('click: ', data)
}

function handleEditEvent(id: string) {
  console.log('edit: ', id)
  title.value = '编辑待办'
  const todoItem = events.value.find((item) => item.id === id)
  form.value = Object.assign(cloneDeep(todoItem)!, {
    time: [todoItem!.time.start, todoItem!.time.end]
  })
  dialogVisible.value = true
}

function handleDeleteEvent(id: string) {
  console.log('delete: ', id)
}

function handleDatetimeClick(datetime: string) {
  title.value = '新增待办'
  const todoForm = defaultForm()
  form.value = Object.assign(todoForm, { time: [datetime, datetime] })
  dialogVisible.value = true
}

function handleDateClick(date: string) {
  title.value = '新增待办'
  const todoForm = defaultForm()
  form.value = Object.assign(todoForm, { time: [`${date} 00:00:00`, `${date} 00:00:00`] })
  dialogVisible.value = true
}

function handleDragedEvent(...args) {
  console.log('handleDragedEvent: ', ...args)
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
    />

    <el-dialog v-model="dialogVisible" :title="title" top="5vh" width="45%" append-to-body>
      <lay-form :model="form" :rules="rules">
        <lay-form-item label="id" prop="id" required>
          <lay-input v-model="form.id" disabled />
        </lay-form-item>
        <lay-form-item label="标题" prop="title">
          <lay-input v-model="form.title" />
        </lay-form-item>
        <lay-form-item label="主题" prop="topic">
          <lay-input v-model="form.topic" />
        </lay-form-item>
        <lay-form-item label="时间" prop="time">
          <lay-date-picker
            v-model="form.time"
            range
            type="datetime"
            :placeholder="['开始日期', '结束日期']"
            style="width: 100%"
          ></lay-date-picker>
        </lay-form-item>
        <lay-form-item label="详情" prop="description">
          <lay-textarea v-model="form.description" placeholder="输入待办详情" />
        </lay-form-item>
        <lay-form-item label="标签" prop="colorSchema">
          <lay-select v-model="form.colorSchema" placeholder="选择标签"></lay-select>
        </lay-form-item>
        <lay-form-item label="地点" prop="location">
          <lay-input v-model="form.location" placeholder="输入地点" />
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
  :deep(.calendar-root-wrapper .calendar-root) {
    @include themeify {
      background-color: themed('color-bg-aside');
    }
  }
}
</style>
