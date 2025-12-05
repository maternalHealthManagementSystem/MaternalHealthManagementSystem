<template>
  <div class="calendar-container">
    <!-- 月份標題和導航 -->
    <div class="calendar-header">
      <!-- 年月（點擊打開選單） -->
      <h2 class="month-title" @click="openMonthPicker">
        {{ currentYear }}年{{ currentMonth }}月
      </h2>

      <!-- 年月 選擇器 -->
      <div v-if="showMonthPicker" class="month-picker-popup">
        <div class="picker-title">選擇年月</div>
        <div class="picker-columns">
          <!-- 年份 -->
          <div class="picker-column">
            <div 
              v-for="y in yearOptions" 
              :key="y"
              class="picker-item"
              :class="{ active: y === tempYear }"
              @click="tempYear = y"
            >
              {{ y }} 年
            </div>
          </div>
          <!-- 月份 -->
          <div class="picker-column">
            <div 
              v-for="m in 12" 
              :key="m"
              class="picker-item"
              :class="{ active: m === tempMonth }"
              @click="tempMonth = m"
            >
              {{ m }} 月
            </div>
          </div>
        </div>
        <div class="picker-actions">
          <button class="confirm-btn" @click="closeMonthPicker()">取消</button>
          <button class="confirm-btn" @click="applyMonth()">確認</button>
        </div>
      </div>
    </div>

    <div class="calender-header-bar">
      <div class="header-left">
        <button class="nav-btn" @click="previousMonth">◀</button>
        <button class="today-btn" @click="goToday">Today</button>
        <button class="nav-btn" @click="nextMonth">▶</button>
      </div>
      <div class="header-right">
        <button class="add-event-btn" @click="openAddEvent">＋</button>
      </div>
    </div>

    <!-- 星期標題 -->
    <div class="weekdays">
      <div class="weekday">一</div>
      <div class="weekday">二</div>
      <div class="weekday">三</div>
      <div class="weekday">四</div>
      <div class="weekday">五</div>
      <div class="weekday">六</div>
      <div class="weekday">日</div>
    </div>

    <!-- 日期格子 -->
    <div class="calendar-grid">
      <div
        v-for="day in calendarDays"
        :key="day.id"
        class="day-cell"
        :class="{
          'other-month': !day.isCurrentMonth,
          'today': day.isToday,
          'has-event': day.events.length > 0
        }"
        @click="selectDay(day)"
      >
        <div class="day-number">{{ day.date }}</div>

        <!-- 顯示事件 -->
        <div class="events">
          <div
            v-for="event in day.events.slice(0, 2)"
            :key="event.id"
            class="event-item"
            :class="`event-${event.type}`"
            @click.stop="handleEventClick(event)"
          >
            {{ event.title }}
          </div>

          <div 
            v-if="day.events.length > 2" 
            class="more-events"
            @click.stop="showMoreEvents(day)"
          >
            +{{ day.events.length - 2 }} 更多
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['dayClick', 'monthChange', 'eventClick'])


// 響應式數據
const currentDate = ref(dayjs())
const selectedDate = ref(null)

// 回到today
function goToday() {
  currentDate.value = dayjs()
  emit('monthChange', {
    year: currentYear.value,
    month: currentMonth.value
  })
}

// 年月選擇器
const showMonthPicker = ref(false)
const tempYear = ref(dayjs().year())
const tempMonth = ref(dayjs().month() + 1)

const yearOptions = computed(() => {
  const years = []
  for (let y = 2000; y <= 2035; y++) years.push(y)
  return years
})

function openMonthPicker() {
  tempYear.value = currentYear.value
  tempMonth.value = currentMonth.value
  showMonthPicker.value = true
}

function applyMonth() {
  currentDate.value = dayjs(`${tempYear.value}-${tempMonth.value}-01`)
  showMonthPicker.value = false

  emit("monthChange", {
    year: currentYear.value,
    month: currentMonth.value
  })
}
function closeMonthPicker() {
  tempYear.value = currentYear.value
  tempMonth.value = currentMonth.value
  showMonthPicker.value = false
}

// 計算屬性
const currentYear = computed(() => currentDate.value.year())
const currentMonth = computed(() => currentDate.value.month() + 1)

// 生成日曆天數
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  // 當月第一天和最後一天
  const firstDay = dayjs(`${year}-${month}-01`)
  const lastDay = firstDay.endOf('month')
  
  // 計算需要顯示的天數
  const startDay = firstDay.startOf('week').add(1, 'day') // 從週一開始
  const endDay = lastDay.endOf('week').add(1, 'day')
  
  const days = []
  let currentDay = startDay
  let dayId = 1
  
  while (currentDay.isBefore(endDay) || currentDay.isSame(endDay, 'day')) {
    const dayData = {
      id: dayId++,
      date: currentDay.date(),
      fullDate: currentDay.format('YYYY-MM-DD'),
      isCurrentMonth: currentDay.month() + 1 === month,
      isToday: currentDay.isSame(dayjs(), 'day'),
      events: getEventsForDay(currentDay)
    }
    
    days.push(dayData)
    currentDay = currentDay.add(1, 'day')
  }
  
  return days
})

// 獲取特定日期的事件
function getEventsForDay(date) {
  const dateStr = date.format('YYYY-MM-DD')
  return props.events.filter(event => event.date === dateStr)
}

// 上個月
function previousMonth() {
  currentDate.value = currentDate.value.subtract(1, 'month')
  emit('monthChange', {
    year: currentYear.value,
    month: currentMonth.value
  })
}

// 下個月
function nextMonth() {
  currentDate.value = currentDate.value.add(1, 'month')
  emit('monthChange', {
    year: currentYear.value,
    month: currentMonth.value
  })
}

// 選擇日期
function selectDay(day) {
  if (day.isCurrentMonth) {
    selectedDate.value = day.fullDate
    emit('dayClick', day)
  }
}

// 處理事件點擊
function handleEventClick(event) {
  emit('eventClick', event)
}

// 顯示更多事件
function showMoreEvents(day) {
  // 可以顯示該日所有事件的列表
  console.log('顯示更多事件:', day.events)
}

// 開啟新增行程
function openAddEvent() {
  emit('addEvent')
}

// 初始化
onMounted(() => {
  // 可以在這裡加載初始事件數據
})
</script>

<style scoped>
.calendar-container {
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  /* flex:  0 0 65%; */
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 800px; 
  padding-bottom: 10px;
  
} 

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.month-title {
  flex-grow: 1;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #606365;
  cursor: pointer;
  user-select: none;
  margin-bottom: 5px;
}

.calender-header-bar{
  display: flex;
  align-items: center; 
  justify-content: space-between;
  padding: 10px;
}

.header-left {
  display: flex; 
  align-items: center; 
}

.nav-btn, 
.today-btn {
  border: 1px solid #ccc;
  padding: 8px 14px;
  cursor: pointer;
  background-color: white;
  color:#0557e5;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s; 
}

.nav-btn:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.nav-btn:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.nav-btn:hover, .today-btn:hover {
  background-color: #f0f0f0;
}

.today-btn {
  margin: 0 8px; 
}

.today-btn:hover {
  background: #b1afaf;
  transform: scale(1.05);
}

.today-btn:active {
  transform: scale(0.95);
}

.header-right{
  display: flex; 
  align-items: center;
}

.add-event-btn {
  border: 1px solid #ccc;
  padding: 0px 8px;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  color:#0557e5;
  font-size: 28px;
  font-weight: bold;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s; 
}

.add-event-btn:hover {
  background-color: #f0f0f0;
}

.add-event-btn:active {
  transform: scale(0.95);
}

.month-picker-popup {
  position: absolute;
  top: 100%; 
  left: 50%;
  transform: translateX(-50%);
  background: white;
  width: 90%;
  max-width: 300px;
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.2);
  z-index: 9999;
}

.picker-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.picker-columns {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.picker-column {
  width: 120px;
  height: 160px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 6px 0;
}

.picker-item {
  padding: 8px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  color: #555;
}

.picker-item:hover {
  background: #e6f4ff;
}

.picker-item.active {
  background: #5eb3e4;
  color: white;
  font-weight: bold;
  border-radius: 6px;
}

.picker-actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.confirm-btn {
  padding: 8px 18px;
  background: #5eb3e4;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 1px;
  /* flex: 0 0 45%; */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  box-shadow: none; 
  padding: 0 15px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  box-shadow: none; 
  padding: 0 15px;
}

.weekday {
  background: #f5f5f5;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 14px;
  border-right: none;  /* 保持分隔線的處理 */
  max-width: 100%;
}

/* 移除每行最右側的邊框，防止凸出 */
.day-cell:nth-child(7n){
  border-right:1px solid #e0e0e0  ;
}

/* 移除每行最左側的邊框) */
.day-cell:nth-child(7n-6){
  border-left: 1px solid #e0e0e0;
}

/* 日期格子邊框修正：確保左右兩側邊緣的格子貼合容器邊緣 */
.day-cell {
  background: white;
  min-height: 90px;
  padding: 6px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.day-cell:hover {
  background: #f8f9fa;
}

.day-cell.other-month {
  background: #fafafa;
  color: #ccc;
}

.day-cell.today {
  background: #e3f2fd;
}

.day-cell.today .day-number {
  background: #5eb3e4;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  flex-shrink: 0; 
  margin-bottom: 4px;
  
}

.events {
  margin-top: 0;
  flex-grow: 1;
  overflow-y: hidden;
  overflow-x: hidden;
}

.event-item {
  font-size: 11px;
  padding: 2px 4px;
  margin-bottom: 2px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;
  box-sizing: border-box;       /* 確保 padding/border 不會使寬度溢出 */
}

.event-item:hover {
  opacity: 0.8;
}

.event-checkup {
  background: #ff6b9d;
}

.event-appointment {
  background: #9c8ec9;
}

.event-other {
  background: #4fc3f7;
}

.event-reminder {
  background: #ffa726;
}

.event-diary {
  background: #4e7d50;
}

.more-events {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
  cursor: pointer;
  text-decoration: underline;
}

.more-events:hover {
  color: #5eb3e4;
}

/* 簡單淡入動畫 */
@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, 5px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

/* iPhne 12 Pro   */
@media (min-width: 350px) and (max-width: 400px) {
  .calendar-container {
    min-width: 100%;
  }
  .day-cell {
    padding: 4px;
    min-height: 60px;
    max-width: 47px;
  }
  .event-item {
    font-size: 10px;
    padding: 2px 4px;
    margin-top: 2px;
    max-width: 38px;
  }
  .events {
    margin-top: 2px;
  }
  
  .more-events {
    font-size: 11px;
  }
  .month-title{
    font-size: 25px;
  }
}

/* iPhne 14 Pro Max   */
@media (min-width: 400px) and (max-width: 450px) {
  .calendar-container {
    min-width: 100%;
  }
  .day-cell {
    padding: 4px;
    min-height: 60px;
    max-width: 47px;
  }
  .event-item {
    font-size: 10px;
    padding: 2px 4px;
    margin-top: 2px;
    max-width: 38px;
  }
  .events {
    margin-top: 2px;
  }
  
  .more-events {
    font-size: 11px;
  }
  .month-title{
    font-size: 25px;
  }
}

/* iPad Air*/
@media (min-width: 750px) and (max-width: 820px){
  .calendar-container {
    min-width: 100%;
  }
  .calendar-header {
    flex-direction: column;
    gap: 8px;
  }
  .month-title {
    font-size: 30px;
  }

  .weekdays div {
    font-size: 15px;
    padding: 6px 0;
  }

  .day-cell {
    min-height: 65px;
  }

  .month-picker-popup {
    width: 95%;
  }
  .event-item{
    font-size: 15px;
  }
}
</style>
