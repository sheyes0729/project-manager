<script setup lang="ts">
import { Solar, SolarYear, HolidayUtil } from 'lunar-typescript'

interface LunarCalendarProps {
  month: number
  year: number
}

const props = defineProps<LunarCalendarProps>()

const now = Solar.fromDate(new Date())
class Day {
  public day = ''
  public text = ''
  public isFestival = false
  public isToday = false
  public isHoliday = false
  public isRest = false
  public isCurrentMonth = false
}

class Month {
  public month = 0
  public days: Day[] = []
}

const state = reactive({
  weekStart: 1, // 0 周日 1 周一
  heads: new Array<string>(),
  months: new Array<Month>()
})

function buildDay(d: Solar, month: number) {
  const lunar = d.getLunar()
  const day = new Day()
  day.day = d.getDay() + ''
  let text = lunar.getDayInChinese()
  if (1 === d.getDay()) {
    text = lunar.getMonthInChinese() + '月'
  }
  let festivals = d.getFestivals()
  if (festivals.length > 0) {
    text = festivals[0]
    day.isFestival = true
  }
  festivals = lunar.getFestivals()
  if (festivals.length > 0) {
    text = festivals[0]
    day.isFestival = true
  }
  const jq = lunar.getJieQi()
  if (jq) {
    text = jq
    day.isFestival = true
  }
  day.text = text
  if (d.toYmd() === now.toYmd()) {
    day.isToday = true
  }
  const h = HolidayUtil.getHoliday(d.getYear(), d.getMonth(), d.getDay())
  if (h) {
    day.isHoliday = true
    day.isRest = !h.isWork()
  }
  day.isCurrentMonth = d.getMonth() == month
  return day
}

function render() {
  const heads = ['日', '一', '二', '三', '四', '五', '六']
  state.heads = heads.slice(state.weekStart).concat(heads.slice(0, state.weekStart - 7))
  const year = SolarYear.fromYear(parseInt(props.year + '', 10))
  const months: Month[] = []
  year.getMonths().forEach((m) => {
    const month = new Month()
    month.month = m.getMonth()
    const weeks = m.getWeeks(state.weekStart)
    weeks.forEach((w) => {
      w.getDays().forEach((d) => {
        month.days.push(buildDay(d, month.month))
      })
    })
    months.push(month)
  })
  state.months = months
}

watch(
  () => props,
  () => {
    render()
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<template>
  <div class="lunar-calendar">
    <div class="body">
      <ul>
        <h3>{{ props.month }}月</h3>
        <li v-for="head in state.heads" class="week">
          {{ head }}
        </li>
        <li
          v-for="day in state.months[props.month - 1]?.days"
          class="day-item"
          :class="{
            festival: day.isFestival,
            today: day.isToday,
            rest: day.isRest,
            other: !day.isCurrentMonth
          }"
        >
          <lay-tooltip :content="day.text">
            {{ day.day }}
          </lay-tooltip>
          <i>{{ day.text }}</i>
          <u v-if="day.isHoliday"> {{ day.isRest ? '休' : '班' }}</u>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$size: 42px;
.lunar-calendar {
  font-family: 'Poppins', sans-serif;
  .body {
    width: 100%;
    overflow: hidden;

    ul {
      position: relative;
      display: grid;
      grid-template-columns: repeat(7, 1fr);

      h3 {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 80px;
        width: 100%;
        text-align: center;
        color: #333;
        opacity: 0.1;
        filter: alpha(opacity=10);
      }

      li {
        position: relative;
        width: $size;
        height: $size;
        color: #444;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        i {
          width: 100%;
          text-align: center;
          display: block;
          font-size: 9px;
          font-style: normal;
          color: #999999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        u {
          font-size: 9px;
          font-style: normal;
          text-decoration: none;
          position: absolute;
          right: 4px;
          top: 0;
          color: #333;
        }
      }

      li.week {
        height: 34px;
        line-height: 33px;
        font-size: 12px;
        color: #333333;
        border-bottom: 1px solid #e3e3e3;
      }

      li.rest {
        u {
          color: var(--global-warm-color);
        }
      }

      li.festival {
        i {
          color: var(--global-danger-color);
        }
      }

      li.today {
        font-weight: $font-weight-bold;
        background: var(--global-normal-color);
        border-radius: 50%;
        color: #ffffff;

        i {
          color: #ffffff;
        }
      }

      li.other {
        opacity: 0.3;
      }
    }
  }
}
</style>
