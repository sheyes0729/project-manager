<script lang="ts" setup>
import { Qalendar } from '@/plugins/qalendar/qalendar.es'
import '@/plugins/qalendar/style.css'
import { LayForm } from '@layui/layui-vue'
import { cloneDeep } from 'lodash'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)

const config = reactive({
  week: {
    startsOn: 'monday',
    nDays: 7,
    scrollToHour: 5
  },
  month: {
    // Hide leading and trailing dates in the month view (defaults to true when not set)
    showTrailingAndLeadingDates: false
  },
  locale: 'zh-CN',
  style: {
    fontFamily: `'Poppins', sans-serif`
  },
  defaultMode: 'month',
  showCurrentTime: true
})

const { system } = useStore()
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
const theme = computed(() => system.value.theme)

const title = ref('')
const dialogVisible = ref(false)
const formRef = shallowRef<InstanceType<typeof LayForm>>()
const isEdit = ref(false)

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
  time: {
    validator(_, value: any, callback: any) {
      console.log('validator: ', value)
      if (!value || value.length == 0 || !value[0] || !value[1]) {
        callback(new Error('时间不能为空'))
        return
      } else {
        return true
      }
    }
  }
})

function handleEditEvent(id: string) {
  isEdit.value = true
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
  isEdit.value = false
  title.value = '新增待办'
  const todoForm = defaultForm()
  form.value = Object.assign(todoForm, { time: [datetime, datetime] })
  dialogVisible.value = true
}

function handleDateClick(date: string) {
  isEdit.value = false
  title.value = '新增待办'
  const todoForm = defaultForm()
  form.value = Object.assign(todoForm, { time: [`${date} 00:00:00`, `${date} 00:00:00`] })
  dialogVisible.value = true
}

function confirm() {
  formRef.value?.validate((isValidate, _, errors) => {
    console.log(isValidate, errors)
  })
}
</script>
<template>
  <div class="todo-wrapper" :style="{ colorScheme: theme }">
    <Qalendar
      :config="config"
      :events="events"
      @edit-event="handleEditEvent"
      @delete-event="handleDeleteEvent"
      @datetime-was-clicked="handleDatetimeClick"
      @date-was-clicked="handleDateClick"
    />

    <el-dialog v-model="dialogVisible" :title="title" top="5vh" width="45%" append-to-body>
      <lay-form ref="formRef" :model="form" :rules="rules">
        <lay-form-item label="id" prop="id" required>
          <lay-input v-model="form.id" disabled />
        </lay-form-item>
        <lay-form-item label="标题" prop="title" required>
          <lay-input v-model="form.title" />
        </lay-form-item>
        <lay-form-item label="主题" prop="topic">
          <lay-input v-model="form.topic" />
        </lay-form-item>
        <lay-form-item label="时间" prop="time" required>
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
          <lay-button type="primary" size="sm" @click="confirm">确定</lay-button>
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
