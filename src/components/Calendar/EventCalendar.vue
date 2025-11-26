<template>
  <div class="calendar-container">

    <!-- 月份標題和導航 -->
    <div class="calendar-header">

      <!-- 左側按鈕群 -->
      <div class="header-left">
        <button class="nav-btn" @click="previousMonth">↑</button>
        <button class="nav-btn" @click="nextMonth">↓</button>
        <button class="today-btn" @click="goToday">今天</button>
      </div>

      <!-- 年月（點擊打開選單） -->
      <h2 class="month-title" @click="openMonthPicker">
        {{ currentYear }}年{{ currentMonth }}月
      </h2>

      <!-- 右側新增事件按鈕 -->
      <div class="header-right">
        <button class="add-event-btn" @click="openAddEvent">＋</button>
      </div>
    </div>

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
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 20px;
  top:11%;
  width: 67%;
  height: auto;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  position: relative;
  margin-bottom: 20px;
}

.header-left{
  display: flex; 
  align-items:center;
  justify-content:flex-start; 
  gap:3px;
  padding: 10px 0px;
  width: 75px;
  height: 40px;
}

.header-right{
  padding: 10px 10px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-title {
  font-size: 28px;
  font-weight: 700;
  color: #5eb3e4;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;     
  user-select: none;
}

/* .month-picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; 
}

.month-picker-modal {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  z-index: 10000;
}

.month-picker-modal select {
  width: 100%;
  margin: 8px 0;
  padding: 6px;
  font-size: 16px;
} */

.month-picker-popup {
  position: absolute;
  top: 80px; /* 🔥 彈窗顯示在標題下方 */
  left: 50%;
  transform: translateX(-50%);
  background: white;
  width: 280px;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.2);
  z-index: 10000;
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
  height: 160px; /* 🔥 像滾輪可滑動 */
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


.nav-btn {
  background: none;
  border: none;
  border-radius: 12px;
  font-size: 40px;
  font-weight: 600;
  color: #414243;
  cursor: pointer;
  transition: 0.2s;
  padding: 5px 10px;
}

.nav-btn:hover {
  background: #f0f0f0;
  color: #8ac2de;
  transform: scale(1.05);
}

.nav-btn:active {
  transform: scale(0.95);
}

.calendar-title {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
}

.calendar-title-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
  position: relative;
}

.add-event-btn {
  background: none;
  border: none;
  border-radius: 12px;
  font-size: 40px;
  font-weight: bold;
  color: #0557e5;
  cursor: pointer;
  transition: 0.2s;
  padding: 5px 10px;
}

.add-event-btn:hover {
  background: #f0f0f0;
  color: #8ac2de;
  transform: scale(1.05);
}

.add-event-btn:active {
  transform: scale(0.95);
}

.today-btn {
  background: #5eb3e4;
  color:white;
  border: none;
  padding: 8px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.today-btn:hover {
  background: #b1afaf;
  transform: scale(1.05);
}

.today-btn:active {
  transform: scale(0.95);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #e0e0e0;
  margin-bottom: 1px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #e0e0e0;

}

.weekday {
  background: #f5f5f5;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.weekday:nth-child(7n),
.day-cell:nth-child(7n){
  border-right: none; /* 每列最後一格不要右邊框 */
}

.day-cell {
  background: white;
  min-height: 100px;
  padding: 8px;
  cursor: pointer;
  position: relative;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
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
  
}

.events {
  margin-top: 4px;
}

.event-item {
  font-size: 11px;
  padding: 3px 6px;
  margin-bottom: 2px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
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

/* 響應式設計 */
@media (max-width: 768px) {
  .calendar-container {
    padding: 10px;
  }

  .day-cell {
    min-height: 70px;
    padding: 4px;
  }

  .day-number {
    font-size: 14px;
  }

  .event-item {
    font-size: 10px;
    padding: 2px 4px;
  }
}
</style>