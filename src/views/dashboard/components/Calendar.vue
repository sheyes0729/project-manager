<script lang="ts" setup>
import { Solar, HolidayUtil } from 'lunar-typescript'
import { layer } from '@layui/layui-vue'
import dayjs from 'dayjs'

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)

const visible = ref(false)
const title = ref('')
const heads = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 0 }
]
const { system, setSystem } = useStore()

interface MoYu {
  offWork: string
  salaryDay: number
  salaryMonth: 'now' | 'next'
  weekDay: any
}

const defaultMoyu: MoYu = {
  offWork: '18:00:00',
  salaryDay: 10,
  salaryMonth: 'next',
  weekDay: [6, 0]
}

const moyu = ref<MoYu>(system.value.moyu || defaultMoyu)
const tempMoyu = ref<MoYu>(system.value.moyu || defaultMoyu)

watch(
  moyu,
  (data) => {
    setSystem(data, 'moyu')
  },
  {
    deep: true
  }
)

function setOffWork() {
  title.value = '设置下班时间'
  openDialog()
}

function setWeekDay() {
  title.value = '设置周末'
  openDialog()
}

function setSalaryDay() {
  title.value = '设置发薪日'
  openDialog()
}

function openDialog() {
  tempMoyu.value = moyu.value
  visible.value = true
}

function confirm() {
  moyu.value = tempMoyu.value
  layer.msg('设置成功！', {
    time: 1500,
    icon: 1
  })
  initData()
  visible.value = false
}

const state = reactive({
  year: now.getFullYear(),
  month: now.getMonth(),
  day: now.getDate(),
  nextFestivalDay: 0,
  nextFestival: '',
  nextOffWork: [0, 0],
  nextWeekday: 0,
  nextSalaryDay: 0
})

function getNextFestival() {
  let count = 0,
    flag = true

  while (flag) {
    ++count
    const solar = Solar.fromYmd(state.year, state.month, state.day).nextDay(count)
    const h = HolidayUtil.getHoliday(solar.getYear(), solar.getMonth() + 1, solar.getDay())
    if (h) {
      state.nextFestivalDay = count
      state.nextFestival = h.getName()
      flag = false
    }
  }
}

function getSalaryDay() {
  if (state.day <= moyu.value.salaryDay) {
    state.nextSalaryDay = moyu.value.salaryDay - state.day
  } else {
    state.nextSalaryDay = dayjs(`${state.year}/${state.month + 1}/${moyu.value.salaryDay}`).diff(
      dayjs(`${state.year}/${state.month}/${state.day}`),
      'days'
    )
  }
}

function getWeekDay() {
  if (moyu.value.weekDay.includes(now.getDay())) {
    state.nextWeekday = 0
  } else {
    const arr = moyu.value.weekDay.map((v: number) => (v == 0 ? 7 : v))
    state.nextWeekday = Math.min(...arr) - now.getDay()
  }
}

let frameworkKey: number | null = null
function getOffWork() {
  if (state.nextWeekday) {
    state.nextOffWork = []
    const allMinutes = dayjs(
      dayjs(`${state.year}/${state.month + 1}/${state.day} ${moyu.value.offWork}`)
    ).diff(new Date(), 'minutes')
    if (allMinutes <= 0) {
      state.nextOffWork = [0, 0]
    } else {
      const hours = Math.floor(allMinutes / 60)
      const minutes = allMinutes % 60
      state.nextOffWork = [hours, minutes]
    }
  } else {
    state.nextOffWork = []
  }
  frameworkKey = requestAnimationFrame(getOffWork)
}

function initData() {
  getSalaryDay()
  getWeekDay()
  if (frameworkKey) {
    cancelAnimationFrame(frameworkKey)
    frameworkKey = null
  }
  getOffWork()
}

onMounted(() => {
  getNextFestival()
  initData()
})

onBeforeMount(() => {
  frameworkKey && cancelAnimationFrame(frameworkKey)
  frameworkKey = null
})
</script>

<template>
  <div class="calendar">
    <header>
      <div>日历</div>
      <lay-space>
        <lay-input-number v-model="year" :min="1960" size="xs" style="width: 100px" />
        年
        <lay-input-number v-model="month" :min="1" :max="12" size="xs" style="width: 80px" />
        月
      </lay-space>
    </header>
    <section class="calendar-body">
      <LunarCalendar :year="year" :month="month" />

      <div class="moyu-wrapper">
        <div>
          <p>
            离下班还有<u
              ><i>{{ state.nextOffWork[0] }}</i> 小时<i>{{ state.nextOffWork[1] }}</i> 分钟</u
            >
          </p>
          <span @click="setOffWork">立即设置>></span>
        </div>

        <div>
          <p>
            离周末还有<u
              ><i>{{ state.nextWeekday }}</i
              >天</u
            >
          </p>
          <span @click="setWeekDay">立即设置>></span>
        </div>

        <div>
          <p>
            离下一个节假日还有<u
              ><i>{{ state.nextFestivalDay }}</i
              >天</u
            >
          </p>
          <em>{{ state.nextFestival }}</em>
        </div>

        <div>
          <p>
            离发工资还有<u
              ><i>{{ state.nextSalaryDay }}</i
              >天</u
            >
          </p>
          <span @click="setSalaryDay"> 立即设置>></span>
        </div>
      </div>
    </section>
  </div>
  <el-dialog v-model="visible" :title="title" append-to-body>
    <section v-if="title === '设置周末'">
      <lay-checkcard-group v-model="tempMoyu.weekDay">
        <lay-checkcard
          v-for="head in heads"
          :key="head.value"
          :title="head.label"
          :value="head.value"
        ></lay-checkcard>
      </lay-checkcard-group>
    </section>

    <section v-if="title === '设置下班时间'">
      <lay-date-picker v-model="tempMoyu.offWork" type="time" />
    </section>

    <section v-if="title === '设置发薪日'">
      <lay-space>
        <lay-select v-model="tempMoyu.salaryMonth">
          <lay-select-option label="当月" value="now" />
          <lay-select-option label="次月" value="next" />
        </lay-select>

        <lay-select v-model="tempMoyu.salaryDay">
          <lay-select-option
            v-for="item in Array.from({ length: 31 }, (_, i) => i + 1)"
            :key="item"
            :label="`${item}`"
            :value="item"
          />
        </lay-select>
      </lay-space>
    </section>

    <template #footer>
      <lay-button size="sm" @click="visible = false">取消</lay-button>
      <lay-button size="sm" type="primary" @click="confirm">确定</lay-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.calendar {
  height: 100%;
  padding: $padding-mini;
  display: flex;
  flex-direction: column;
  gap: $padding-mini;

  header {
    font-size: $font-small;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .calendar-body {
    flex: 1;
    overflow-y: auto;

    .moyu-wrapper {
      padding: $padding-small 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $padding-mini;
      font-size: $font-mini;
      > div {
        padding: $padding-mini;
        border-radius: $radius-mini;
        display: flex;
        flex-direction: column;
        gap: 4px;
        @include themeify {
          background-color: themed('color-bg');
        }

        > p {
          display: flex;
          justify-content: space-between;
          i {
            font-size: $font-base;
            font-weight: $font-weight-bold;
            color: var(--global-normal-color);
          }

          u {
            text-decoration: none;
          }
        }

        > span {
          cursor: pointer;
          font-size: 10px;
          display: inline-flex;
          justify-content: space-between;
        }
        em {
          color: var(--global-warm-color);
        }
      }
    }
  }
}
</style>
