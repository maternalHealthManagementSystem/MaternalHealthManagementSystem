<template>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import EventCalendar from '@/components/Calendar/EventCalendar.vue'
import EventDetailModal from '@/components/Calendar/EventDetailModal.vue'
import EventEditForm from '@/components/Calendar/EventEditForm.vue'
import EventAddForm from '../components/Calendar/EventAddForm.vue'  
import DiaryDetailModal from '@/components/Calendar/DiaryDetailModal.vue'
import DiaryEditForm from '@/components/Calendar/DiaryEditForm.vue'
import dayjs from 'dayjs'

// 彈窗狀態
const showEventDetail = ref(false)
const showEditForm = ref(false)
const showAddForm = ref(false)
const showDiaryDetail = ref(false)
const showDiaryEdit = ref(false)
const defaultAddDate = ref("")

const selectedDiary = ref({
    id:'',
    date: '',
    title: '',
    content: '',
    image: '',
    createdAt: '',
    updatedAt: ''
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

// 行程資料
const events = ref([
  {
    id: 1,
    date: '2025-11-30',
    startDate: '2025-11-30',
    title: '第一次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '確認懷孕週數、抽血檢驗、超音波檢查'
  },
  {
    id: 2,
    date: '2025-12-07',
    startDate: '2025-12-07',
    title: '第二次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎心音監測'
  },
  {
    id: 3,
    date: '2025-12-21',
    startDate: '2025-12-21',
    title: '第三次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '唐氏症篩檢、超音波檢查'
  },
  {
    id: 4,
    date: '2026-01-04',
    startDate: '2026-01-04',
    title: '第四次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎兒發育監測'
  },
  {
    id: 5,
    date: '2026-01-18',
    startDate: '2026-01-18',
    title: '第五次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '妊娠糖尿病篩檢、血壓監測'
  },
  {
    id: 6,
    date: '2026-02-01',
    startDate: '2026-02-01',
    title: '第六次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎動與羊水量檢查'
  },
  {
    id: 7,
    date: '2026-02-15',
    startDate: '2026-02-15',
    title: '第七次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '超音波檢查、胎兒位置確認'
  },
  {
    id: 8,
    date: '2026-03-01',
    startDate: '2026-03-01',
    title: '第八次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎心音監測'
  },
  {
    id: 9,
    date: '2026-03-15',
    startDate: '2026-03-15',
    title: '第九次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '胎兒發育監測、血壓與體重檢查'
  },
  {
    id: 10,
    date: '2026-03-29',
    startDate: '2026-03-29',
    title: '第十次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '例行產檢、胎兒位置與羊水量檢查'
  },
  {
    id: 11,
    date: '2026-04-05',
    startDate: '2026-04-05',
    title: '第十一至十四次產檢',
    type: 'checkup',
    startTime: '09:00',
    endTime: '10:00',
    location: '台中榮總',
    description: '每週一次例行產檢，監測胎兒狀況直到臨盆'
  },
  {
    id: 12,
    date: '2026-03-20',
    startDate: '2026-03-20',
    title: '待產包準備提醒',
    type: 'reminder',
    startTime: '20:00',
    endTime: '21:00',
    location: '家中',
    description: '準備待產包：證件、換洗衣物、嬰兒用品'
  },
  {
    id: 13,
    date: '2025-12-05',
    startDate: '2025-12-05',
    title: '產檢後運動提醒',
    type: 'reminder',
    startTime: '18:00',
    endTime: '18:30',
    location: '社區公園',
    description: '輕鬆散步 30 分鐘，促進血液循環'
  }
]
)

// 日記資料
const diaries = ref([
  {
    id: 201,
    date: '2025-11-29',
    title: '美食冒險',
    content: '今天突然想吃酸酸甜甜的水果，切了鳳梨和奇異果，滿足了味蕾。',
    image: 'public/images/鳳梨奇異果.jpg',
    createdAt: '2025-11-29T12:45:00Z',
    updatedAt: ''
  },
  {
    id: 202,
    date: '2025-11-30',
    title: '產檢的安心感',
    content: '今天去產檢，聽到寶寶的心跳聲，覺得很安心，醫生說一切正常。',
    image: 'public/images/超音波小月份.jpg',
    
    updatedAt: '2025-11-30T12:45:00Z'
  },
  {
    id: 203,
    date: '2025-12-01',
    title: '孕婦的購物日',
    content: '今天去買了幾件孕婦裝，穿起來舒服又好看，心情大好。',
    image: 'public/images/購物.jpg',
    createdAt: '2025-12-01T18:20:00Z',
    updatedAt: ''
  },
  {
    id: 204,
    date: '2025-12-03',
    title: '甜點時光',
    content: '今天做了黑糖紅豆湯，暖暖的甜味讓心情也變得溫柔。',
    image: 'public/images/黑糖紅豆湯.jpg',
    createdAt: '2025-12-03T16:00:00Z',
    updatedAt: ''
  },
  {
    id: 205,
    date: '2025-12-05',
    title: '瑜伽練習',
    content: '跟著影片做孕婦瑜伽，伸展身體的同時覺得很放鬆，呼吸也更順暢。',
    image: 'public/images/孕婦瑜伽.jpg',
    createdAt: '2025-12-05T19:00:00Z',
    updatedAt: ''
  }
])

// 合併事件和日記（用於顯示在日曆上）
const allEvents = computed(() => {
  const diaryEvents = diaries.value.map(diary => ({
    ...diary,
    type: 'diary', 
    isDiary: true 
  }))
  return [...events.value, ...diaryEvents]
})


// 處理行程、日記點擊 
function handleEventClick(event) {
  console.log('handleEventClick 被觸發!')
  console.log('event:', event)

  // 判斷是日記還是行程
  if (event.isDiary) {
    // 顯示日記詳細資訊
    selectedDiary.value = { ...event }
    showDiaryDetail.value = true
  } else {
    // 顯示行程詳細資訊
    selectedEvent.value = { ...event }
    showEventDetail.value = true
  }
}

// 處理行程編輯事件
function handleEditEvent(event) {
  console.log('編輯事件:', event)
  selectedEvent.value = { ...event }
  showEventDetail.value = false
  showEditForm.value = true
}

// 處理儲存編輯後的行程事件
function handleSaveEvent(updatedEvent) {
  console.log('儲存編輯行程:', updatedEvent)
  
  // 在 events 陣列中找到並更新行程事件
  const index = events.value.findIndex(e => e.id === updatedEvent.id)
  if (index > -1) {
    events.value[index] = { ...updatedEvent }
    alert('行程已更新！')
  }
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
  
  // 加入到 events 陣列
  events.value.push(newEvent)
  showAddForm.value = false
}

// 處理刪除事件
function handleDeleteEvent(eventId) {
  console.log('刪除事件 ID:', eventId)
  const index = events.value.findIndex(e => e.id === eventId)
  if (index > -1) {
    events.value.splice(index, 1)
    showEventDetail.value = false
    alert('行程已刪除')
  }
}

// 關閉行程詳細資訊視窗
function closeEventDetail() {
  console.log('關閉彈窗')
  showEventDetail.value = false
}

// 新增日記表單
const newDiary = ref({
  date: '',
  title: '',
  content: '',
  imagePreview: null,
  imageFile: null
})

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

// 建立新日記
  const diary = {
    id: Date.now(),
    date: newDiary.value.date,
    title: newDiary.value.title || '今日日記',
    content: newDiary.value.content,
    image: newDiary.value.imagePreview,
    createdAt: new Date().toISOString()
  }
  
  console.log('儲存日記:', diary)
  
  // 加入到日記陣列
  diaries.value.push(diary)
  
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
  const index = diaries.value.findIndex(d => d.id === diaryId)
  if (index > -1) {
    diaries.value.splice(index, 1)
    showDiaryDetail.value = false
    alert('日記已刪除')
  }
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
  
  // 在 diaries 陣列中找到並更新日記
  const index = diaries.value.findIndex(d => d.id === updatedDiary.id)
  if (index > -1) {
    diaries.value[index] = { ...updatedDiary }
    alert('日記已更新！')
  }
  
  showDiaryEdit.value = false
}
</script>

<style scoped>
.content-wrapper {
  /* height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto; */
  background: #f5f7fa;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  /* display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  height: calc(100vh - 80px); 
  overflow: hidden;
  padding: 0 20px;
  max-width: 1600px;
  margin: 0 auto; */
  }

.calendar-section {
  /* border-radius: 8px;
  padding: 25px;
  position: fixed;
  left: 20px;
  top:10%;
  width: 70%;
  height: auto; */
  flex: 2 1 65%;
  min-width: 500px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.diary-section {
  /* background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  right: 20px;
  top:11%;
  width: 30%;
  height: auto;*/
  flex: 1 1 30%;
  min-width: 280px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  margin-bottom: 20px;
  padding-top: 10px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
}

.diary-form{
  display: flex;
  flex-direction: column;

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
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
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

/* 響應式：平板 */
@media (max-width: 1024px) {
.content-wrapper {
grid-template-columns: 1fr;
height: auto;
}
.calendar-section,
.diary-section {
height: auto;
overflow: visible;
}
}


/* 手機版 */
@media (max-width: 650px) {
.content-wrapper {
padding: 10px;
}
.diary-section {
margin-top: 10px;
}
}
</style>