<template>
  <div class="calendar-dashboard">
    <div class="content-wrapper">
      <!-- 行事曆區域 -->
      <div class="calendar-section">
        <EventCalendar 
          :events="allEvents"
          @dayClick="handleDayClick"
          @monthChange="handleMonthChange"
          @eventClick="handleEventClick"
          @addEvent="handleAddEvent"
        />
      </div>
      
      <!-- 新增日記區域 -->
      <div class="diary-section">
        <div class="diary-form">
          <h3>新增日記</h3>
          <div class="form-group">
            <label>日期：</label>
            <select v-model="newDiary.date" class="date-select">
              <option value="" disabled>請選擇日期或點擊日曆選擇日期</option>
              <option
                v-for="day in dateOptions"
                :key="day.value"
                :value="day.value"
              >
                {{ day.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <textarea
              v-model="newDiary.title"
              placeholder="幫今天取個小標題吧～"
            ></textarea>
          </div>
          
          <div class="form-group">
            <textarea 
              v-model="newDiary.content"
              placeholder="今天發生了什麼事呢？寫下來吧！"
              rows="8"
            ></textarea>
          </div>
          
          <div class="form-group">
            <div class="image-upload" @click="triggerFileUpload">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                style="display: none"
              />
              <div class="upload-placeholder" v-if="!newDiary.imagePreview">
                <span>📷</span>
                <p>快來丟張照片，讓日記更精彩！</p>
              </div>
              <div class="image-preview" v-else>
                <img :src="newDiary.imagePreview" alt="預覽圖片" />
                <button class="remove-image" @click.stop="removeImage">✕</button>
              </div>
            </div>
            <p class="upload-hint">支援 JPG、PNG 格式，檔案大小不超過 5MB</p>
          </div>
          
          <!-- 底部按鈕 -->
          <div class="form-actions">
            <button class="btn-cancel" @click="resetDiaryForm">清除</button>
            <button class="btn-save" @click="saveDiary" :disabled="!newDiary.date">儲存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 行程詳細資訊彈窗 -->
    <EventDetailModal
      :show="showEventDetail"
      :event="selectedEvent"
      @close="closeEventDetail"
      @delete="handleDeleteEvent"
      @edit="handleEditEvent"
    />

    <!-- 編輯行程表單 -->
    <EventEditForm
      :show="showEditForm"
      :event="selectedEvent"
      @close="showEditForm = false"
      @save="handleSaveEvent"
    />

    <!-- 新增行程表單 -->
    <EventAddForm
      :show="showAddForm"
      :defaultDate="defaultAddDate"
      @close="showAddForm = false"
      @save="handleAddNewEvent"
    />

    <!-- 日記詳細資訊彈窗 -->
    <DiaryDetailModal
      :show="showDiaryDetail"
      :diary="selectedDiary"
      @close="showDiaryDetail = false"
      @delete="handleDeleteDiary"
      @edit="handleEditDiary"
      @save="handleSaveDiary"
    />

    <!-- 編輯日記表單 -->
    <DiaryEditForm
      :show="showDiaryEdit"
      :diary="selectedDiary"
      @close="showDiaryEdit = false"
      @save="handleSaveDiary"
    />
  <CalendarSystem />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import EventCalendar from '../components/Calendar/EventCalendar.vue'
import EventDetailModal from '../components/Calendar/EventDetailModal.vue'
import EventEditForm from '../components/Calendar/EventEditForm.vue'
import EventAddForm from '../components/Calendar/EventAddForm.vue'  
import DiaryDetailModal from '../components/Calendar/DiaryDetailModal.vue'
import DiaryEditForm from '../components/Calendar/DiaryEditForm.vue'
import dayjs from 'dayjs'

import { useCalendarStore } from '../stores/calendarStore.js'
const calendarStore = useCalendarStore()

// --- 新增路由實例 ---
const route = useRoute()

// 彈窗狀態
const showEventDetail = ref(false)
const showEditForm = ref(false)
const showAddForm = ref(false)
const showDiaryDetail = ref(false)
const showDiaryEdit = ref(false)
const defaultAddDate = ref("")

// 新增日記表單
const selectedDiary = ref({
  id:'',
  date: '',
  title: '',
  content: '',
  image: '',
  createdAt: '',
  updatedAt: ''
})

// 新增日記表單
const newDiary = ref({
  date: '',
  title: '',
  content: '',
  imagePreview: null,
  imageFile: null
})

const selectedEvent = ref({
  id: '',
  date: '',
  title: '',
  type: '',
  startDate: '',
  startTime: '',
  endTime: '',
  location: '',
  description: ''
})

// 合併事件和日記（用於顯示在日曆上）
const allEvents = computed(() => calendarStore.allEvents)

// 在元件掛載後檢查是否有編輯行程的 ID
onMounted(() => {
  // 檢查是否有傳遞特定日期，並選中它（如果有需要的話）
  if (route.query.date) {
      // 如果 Home 頁面傳遞了日期，可以讓日曆定位到該月份，或讓日記表單選中該日期
      newDiary.value.date = route.query.date
      currentMonth.value = dayjs(route.query.date) // 讓日曆顯示該月份
  }

  // 檢查是否有傳遞要編輯的 Event ID
  if (route.query.editEventId) {
      const eventId = parseInt(route.query.editEventId);
      // 嘗試從 Store 的 events 陣列中找到該行程 
      const eventToEdit = calendarStore.events.find(e => e.id === eventId);
      
      if (eventToEdit) {
          // 找到後，將其設置為 selectedEvent 並打開編輯表單
          selectedEvent.value = { ...eventToEdit };
          showEditForm.value = true;
      }
  }
  
  // 檢查日記編輯參數 
  if (route.query.editDiaryId) {
      const diaryId = parseInt(route.query.editDiaryId);
      // 從 Store 的 diaries 陣列中找到該日記
      const diaryToEdit = calendarStore.diaries.find(d => d.id === diaryId);
      
      if (diaryToEdit) {
          // 找到後，設置為 selectedDiary 並打開【日記編輯】表單
          selectedDiary.value = { ...diaryToEdit };
          showDiaryEdit.value = true; 
          
          // 如果同時傳了日期，確保日記表單選中該日期
          if (route.query.date) {
              newDiary.value.date = route.query.date;
          }
      }
    }
})

// 處理行程、日記點擊 
function handleEventClick(event) {
  console.log('handleEventClick 被觸發!')
  console.log('event:', event)

  // 判斷是日記還是行程
  if (event.isDiary) {
    // 顯示日記詳細資訊
    const fullDiary = calendarStore.diaries.find(d => d.id === event.id);
    selectedDiary.value = { ...fullDiary }
    showDiaryDetail.value = true
  } else {
    // 顯示行程詳細資訊
    selectedEvent.value = { ...event }
    showEventDetail.value = true
  }
}

// 處理行程編輯事件
function handleEditEvent(event) {
    selectedEvent.value = { ...event }
    showEventDetail.value = false
    showEditForm.value = true
}

// 處理儲存編輯後的行程事件
function handleSaveEvent(updatedEvent) {
    console.log('儲存編輯行程:', updatedEvent)
    // *** 呼叫 Store 的 Action ***
    calendarStore.updateEvent(updatedEvent)
    alert('行程已更新！')

    showEditForm.value = false
}

// 處理新增行程按鈕點擊 
function handleAddEvent() {
    console.log('開啟新增行程表單')
    defaultAddDate.value = dayjs().format('YYYY-MM-DD')
    showAddForm.value = true
}

// 處理新增新行程
function handleAddNewEvent(newEvent) {
    console.log('新增行程:', newEvent)
    // *** 呼叫 Store 的 Action ***
    calendarStore.addEvent(newEvent)
    showAddForm.value = false
}

// 處理刪除事件 
function handleDeleteEvent(eventId) {
    console.log('刪除事件 ID:', eventId)
    // *** 呼叫 Store 的 Action ***
    calendarStore.deleteEvent(eventId)
    showEventDetail.value = false
    alert('行程已刪除')
}

// 關閉行程詳細資訊視窗
function closeEventDetail() {
  console.log('關閉彈窗')
  showEventDetail.value = false
}

// 檔案上傳參考
const fileInput = ref(null)

// 計算顯示的日期格式 (月/日)
const selectedDateDisplay = computed(() => {
  if (!newDiary.value.date) {
    return ''
  }
  const date = dayjs(newDiary.value.date)
  return date.format('MM/DD')
})

/// 建立下拉選單日期（依目前月份）
const currentMonth = ref(dayjs())
const dateOptions = computed(() => {
const daysInMonth = currentMonth.value.daysInMonth()
const year = currentMonth.value.year()
const month = currentMonth.value.month() + 1
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1
    const fullDate = dayjs(`${year}-${month}-${d}`).format('YYYY-MM-DD')
    const label = dayjs(fullDate).format('MM/DD')
    return {
      value: fullDate,
      label
    }
  })
})

// 處理點擊日曆
function handleDayClick(day) {
    console.log('選擇日期:', day)
  newDiary.value.date = day.fullDate
}

// 處理月份變更
function handleMonthChange({ year, month }) {
  currentMonth.value = dayjs(`${year}-${month}-01`)
}

// 觸發檔案上傳
function triggerFileUpload() {
  fileInput.value?.click()
}

// 處理檔案上傳
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片檔案')
      return
    }
    
    // 檢查檔案大小 (限制 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('圖片大小不能超過5MB')
      return
    }
    
    // 讀取圖片預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      newDiary.value.imagePreview = e.target.result
      newDiary.value.imageFile = file
    }
    reader.readAsDataURL(file)
  }
}

// 移除圖片
function removeImage() {
  newDiary.value.imagePreview = null
  newDiary.value.imageFile = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 儲存日記
function saveDiary() {
    if (!newDiary.value.date) {
        alert('請選擇日期')
        return
    }
    if (!newDiary.value.content && !newDiary.value.imagePreview) {
        alert('請輸入日記內容或上傳圖片')
        return
    }

    // 建立新日記 (ID 生成邏輯保持不變)
    const diary = {
        id: Date.now(), // 這裡使用時間戳記作為 ID
        date: newDiary.value.date,
        title: newDiary.value.title || '今日日記',
        content: newDiary.value.content,
        image: newDiary.value.imagePreview,
        createdAt: new Date().toISOString()
    }

    console.log('儲存日記:', diary)

    // *** 呼叫 Store 的 Action ***
    calendarStore.addDiary(diary)

    alert(`日記已儲存！\n日期：${selectedDateDisplay.value}`)

    // 重置日記表單
    resetDiaryForm()
}

// 重置日記表單
function resetDiaryForm() {
  newDiary.value = {
    date: '',
    title: '',
    content: '',
    imagePreview: null,
    imageFile: null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 處理刪除日記
function handleDeleteDiary(diaryId) {
    console.log('刪除日記 ID:', diaryId)
    // *** 呼叫 Store 的 Action ***
    calendarStore.deleteDiary(diaryId)
    showDiaryDetail.value = false
    alert('日記已刪除')
}

// 處理編輯日記
function handleEditDiary(diary) {
  console.log('編輯日記:', diary)
  selectedDiary.value = { ...diary }
  showDiaryDetail.value = false
  showDiaryEdit.value = true
}

// 處理儲存編輯後的日記
function handleSaveDiary(updatedDiary) {
    console.log('儲存編輯日記:', updatedDiary)
    // *** 呼叫 Store 的 Action ***
    calendarStore.updateDiary(updatedDiary)
    alert('日記已更新！')

    showDiaryEdit.value = false
}
</script>

<style scoped>
.calendar-dashboard{
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.content-wrapper {
  /* display: flex;
  justify-content: center;   
  align-items: flex-start;
  gap: 20px;
  background: #f5f7fa;
  flex-wrap: nowrap;
  margin: 30px auto; */
  display: flex;
  flex-wrap: nowrap;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
}

.calendar-section {
  flex:  0 0 65%;
  width: 100%;
  min-width: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  padding: 0;
}

.calendar-section > * {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 15px;
}

.diary-section {
  flex: 0 0 25%;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: white;
  border-radius: 8px;
  padding: 20px;
   min-width: 0;
}

.diary-section > * {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 15px;
}


.date-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  font-size: 14px;
  color: #666;
}

.diary-form h3 {
  color: #606365;
  margin-top: 18px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
}

.date-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #f9f9f9;
  cursor: default;
  color: #999;
}

.date-input::placeholder {
  color: #999;
}

.form-group textarea {
  width: 95%;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  padding: 10px;
  margin: 0;
}

.image-upload {
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.upload-placeholder {
  width: 100%;
  height: 150px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  transition: all 0.3s;
}

.upload-placeholder:hover {
  border-color: #5eb3e4;
  background: #f0f8ff;
}

.upload-placeholder span {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-placeholder p {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.image-preview {
  width: 100%;
  height: 200px;
  position: relative;

}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
}


.remove-image:hover {
  background: rgba(165, 163, 163, 0.9);
  transform: scale(1.1);
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin: 8px 0 0 0;
  text-align: center;
}

/* 底部按鈕 */
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-save {
flex: 1;
background: #5eb3e4;
color: white;
border: none;
padding: 12px;
border-radius: 6px;
}
.btn-cancel {
flex: 1;
background: white;
border: 1px solid #ddd;
padding: 12px;
border-radius: 6px;
}
.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-save {
  background: #5eb3e4;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #4a9fd4;
  box-shadow: 0 4px 8px rgba(94, 179, 228, 0.4);
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* iPhne 14 Pro Max */
@media (max-width: 450px) {
  .calendar-section {
    min-width: 380px;
    width: 90%;
  }
}

/* iPhne 12 Pro  */
@media (max-width: 400px){
  .calendar-section {
    min-width: 340px;
  }
  .diary-section {
    width: 90%;;
  }
}


/* iPad Air*/
@media (max-width: 850px)  {
  .content-wrapper {
    flex-direction: column;
    flex-wrap: wrap;
  }

  .calendar-section {
    width: 100%;
    min-height: auto;
  }

  .calendar-section {
    order: 1; /* 行事曆上面 */
  }

  .diary-section {
    order: 2; /* 日記下面 */
    width: 95%;
  }
}


/* 手機版（450px 以下） */
@media (max-width: 450px) {
  .diary-section{
    width: 90%;
  }
}
</style>
