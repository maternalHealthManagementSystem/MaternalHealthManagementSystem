<template>
  <div class="maternal-dashboard">
    <div class="main-content-container">
      <div class="left-panel">
        <div class="top-info-container">
          <p class="fruit-text" v-if="currentData.name">
            你的寶寶大約和 <strong>{{ currentData.name }}</strong> 一樣大
          </p>

          <div class="baby-size-info"  v-if="currentData.length || currentData.weight">
            <p class="size-item">
              <span class="label">平均長度:</span>
              <strong>{{ currentData.length }}</strong>
            </p>
            <p class="size-item">
              <span class="label">平均重量:</span>
              <strong>{{ currentData.weight }}</strong>
            </p>
          </div>
        </div>
        <div class="image-placeholder">
          <img
            v-if="currentData.img"
            :src="currentData.img"
            alt="baby size"
            class="baby-fruit-img"
          />
        </div>

        <div class="pregnancy-tracker">
          <span class="week-day-text">{{ currentWeek }}</span>
          <span class="divider">週</span>
          <span class="week-day-text">{{ currentDay }}</span>
          <span class="divider">天</span>
        </div>
      </div>

      <div class="right-panel">
        <div class="calendar-section">
          <EventCalendar 
            :events="allEvents"
            @dayClick="handleDayClick"
            @monthChange="handleMonthChange"
            @eventClick="handleEventClick"
            @addEvent="handleAddEvent"
          />
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
    @close="closeDiaryDetail"
    @delete="handleDeleteDiary"
    @edit="handleEditDiary"
    @save="handleSaveDiary"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; 
import { useRouter } from 'vue-router'; 
import EventCalendar from '../components/Calendar/EventCalendar.vue';
import EventDetailModal from '../components/Calendar/EventDetailModal.vue';
import EventAddForm from '../components/Calendar/EventAddForm.vue'; 
import DiaryDetailModal from '../components/Calendar/DiaryDetailModal.vue';
import { useCalendarStore } from '../stores/calendarStore'; // 使用相對路徑避免別名問題
import dayjs from 'dayjs';


const calendarStore = useCalendarStore();
const router = useRouter(); 


// 彈窗狀態
const showEventDetail = ref(false);
const showAddForm = ref(false);
const showDiaryDetail = ref(false);
const defaultAddDate = ref("");

// 選中的事件
const selectedEvent = ref({});

// 選中的日記 
const selectedDiary = ref({});

// --- Computed ---
// 從 Store 取得合併後的事件和日記
const allEvents = computed(() => calendarStore.allEvents);

// --- 函式處理 ---
onMounted(() => {
  console.log("Home page loaded.");
});

// 處理日曆事件點擊
function handleEventClick(event) {
  console.log('Home Page: Event Clicked', event);

  if (event.isDiary) {
  // 必須從 Store 中找到最新的完整日記資料，因為 event 可能是合併後的簡化版
  const fullDiary = calendarStore.diaries.find(d => d.id === event.id);
  selectedDiary.value = { ...fullDiary };
  showDiaryDetail.value = true;
  } else {
  // 點擊行程：顯示行程詳細資訊彈窗
  selectedEvent.value = { ...event };
  showEventDetail.value = true;
  }
}

// 關閉行程詳細資訊視窗
function closeEventDetail() {
 showEventDetail.value = false;
}

// 關閉日記詳細資訊視窗
function closeDiaryDetail() {
 showDiaryDetail.value = false;
}

// 處理新增行程按鈕點擊
function handleAddEvent() {
  console.log('開啟新增行程表單');
  defaultAddDate.value = dayjs().format('YYYY-MM-DD');
  showAddForm.value = true;
}

// 處理新增新行程
function handleAddNewEvent(newEvent) {
  console.log('Home Page - 新增行程:', newEvent);
  calendarStore.addEvent(newEvent); 
  showAddForm.value = false;
}

// 處理刪除事件 (行程)
function handleDeleteEvent(eventId) {
  console.log('Home Page - 刪除事件 ID:', eventId);
  calendarStore.deleteEvent(eventId); 
  showEventDetail.value = false;
  alert('行程已刪除');
}

// 處理刪除日記 
function handleDeleteDiary(diaryId) {
  console.log('Home Page - 刪除日記 ID:', diaryId);
  calendarStore.deleteDiary(diaryId);
  showDiaryDetail.value = false;
  alert('日記已刪除');
}

// 處理編輯行程 - 導航
function handleEditEvent(event) {
 console.log('Home Page - 編輯行程，導航至 PregnancyDiary');
 showEventDetail.value = false;
 router.push({ 
   name: 'PregnancyDiary', 
   query: { 
   editEventId: event.id 
    } 
  });
}

// 處理編輯日記 - 導航 
function handleEditDiary(diary) {
 console.log('Home Page - 編輯日記，導航至 PregnancyDiary');
 showDiaryDetail.value = false;
 router.push({ 
   name: 'PregnancyDiary', 
   query: { 
   editDiaryId: diary.id, // 使用不同的參數名稱區分行程和日記
   date: diary.date
    } 
  });
}


// 只需要處理日曆需要的回調 
function handleDayClick(day) { 
  console.log('Home Page - Date Clicked:', day.fullDate);
}
function handleMonthChange(month) { 
  console.log('Home Page - Month Changed:', month);
}

const babySizeMap = {
  // --- 懷孕初期 (CRL) ---
  4: {
    name: "芝麻",
    img: "https://i.imgur.com/YbNw0q8.png",
    length: "~0.2 cm (頭臀長 CRL)",
    weight: "極微小 (<1g)",
  },
  5: {
    name: "葡萄籽",
    img: "https://i.imgur.com/0zoY9Zj.png",
    length: "~0.4 cm (頭臀長 CRL)",
    weight: "極微小 (<1g)",
  },
  6: {
    name: "豌豆",
    img: "https://i.imgur.com/qsYt5sY.png",
    length: "~0.5 cm (頭臀長 CRL)",
    weight: "極微小 (<1g)",
  },
  7: {
    name: "藍莓",
    img: "https://i.imgur.com/MQbleR9.png",
    length: "~1.3 cm (頭臀長 CRL)",
    weight: "~1 g",
  },
  8: {
    name: "覆盆子",
    img: "https://i.imgur.com/EhDfIB5.png",
    length: "~1.6 cm (頭臀長 CRL)",
    weight: "~1 g",
  },
  9: {
    name: "櫻桃",
    img: "https://i.imgur.com/Lz4ckTl.png",
    length: "~2.3 cm (頭臀長 CRL)",
    weight: "~2 g",
  },

  10: {
    name: "草莓",
    img: "https://i.imgur.com/5kEjX5O.png",
    length: "3.1~4.2 cm (頭臀長 CRL)",
    weight: "5 g",
  },
  11: {
    name: "金桔",
    img: "https://i.imgur.com/nQxGgUe.png", // 沿用
    length: "4.4~6.0 cm (頭臀長 CRL)",
    weight: "8 g",
  },
  12: {
    name: "青芒果",
    img: "public/fruitimg/greenmango.png", // 沿用
    length: "6.1 cm (頭臀長 CRL)",
    weight: "8~14 g",
  },
  // --- 懷孕中期 (CHL / 總身長) ---
  13: {
    name: "百香果",
    img: "https://i.imgur.com/zKAwx04.png", // 沿用
    length: "6.5~7.8 cm (頭臀長)", // 13週常仍用CRL
    weight: "13~20 g",
  },
  14: {
    name: "檸檬",
    img: "https://i.imgur.com/biQXoWj.png", // 沿用
    length: "8.0~9.3 cm",
    weight: "25 g",
  },
  15: {
    name: "酪梨 (中型)",
    img: "https://i.imgur.com/ePAmbSg.png", // 沿用
    length: "9.3~10.3 cm",
    weight: "50 g",
  },
  16: {
    name: "甜橙/橘子",
    img: "https://i.imgur.com/x5WqYeC.png", // 沿用
    length: "10.8~11.6 cm",
    weight: "80 g",
  },
  17: {
    name: "洋蔥",
    img: "https://i.imgur.com/vF2kPHL.png", // 沿用
    length: "11.0~12.0 cm",
    weight: "100 g",
  },
  18: {
    name: "甜椒 (大型)",
    img: "https://i.imgur.com/4p7ct8b.png", // 沿用
    length: "12.5~14.0 cm",
    weight: "150 g",
  },
  19: {
    name: "大芒果",
    img: "https://i.imgur.com/VTFJjOz.png", // 沿用
    length: "13.0~15.0 cm",
    weight: "200 g",
  },
  20: {
    name: "香蕉 (整根)",
    img: "https://i.imgur.com/QDPuNQb.png", // 沿用
    length: "14.0~16.0 cm",
    weight: "260 g",
  },
  21: {
    name: "絲瓜",
    img: "https://i.imgur.com/WrxHadF.png", // 沿用
    length: "18.0 cm (頭腳長)",
    weight: "300 g",
  },
  22: {
    name: "茄子 (長型)",
    img: "https://i.imgur.com/1m2CNmV.png", // 沿用
    length: "19.0 cm (頭腳長)",
    weight: "350 g",
  },
  23: {
    name: "文旦/葡萄柚",
    img: "https://i.imgur.com/LF0Jk0C.png", // 沿用
    length: "20.0 cm (頭腳長)",
    weight: "455 g",
  },
  24: {
    name: "玉米筍 (連殼)",
    img: "https://i.imgur.com/e7xJngZ.png", // 沿用
    length: "21.0 cm (頭腳長)",
    weight: "540 g",
  },
  25: {
    name: "高麗菜 (小顆)",
    img: "https://i.imgur.com/W0yWS4W.png", // 沿用
    length: "22.0 cm (頭腳長)",
    weight: "700 g",
  },
  26: {
    name: "紅蘿蔔 (大根)",
    img: "https://i.imgur.com/lzCcXqC.png", // 沿用
    length: "23.0 cm (頭腳長)",
    weight: "910 g",
  },
  27: {
    name: "花椰菜 (整顆)",
    img: "https://i.imgur.com/fj0sYw1.png", // 沿用
    length: "24.0 cm (總身長約34.0 cm)",
    weight: "1000 g (1 公斤)",
  },
  // --- 懷孕後期 (總身長) ---
  28: {
    name: "大頭菜",
    img: "https://i.imgur.com/cTIX3HH.png", // 沿用
    length: "25.0 cm (總身長約35.0 cm)",
    weight: "1100 g (1.1 公斤)",
  },
  29: {
    name: "鳳梨 (小顆)",
    img: "https://i.imgur.com/NYLoj1R.png", // 沿用
    length: "26.0 cm (總身長約37.0 cm)",
    weight: "1250 g (1.25 公斤)",
  },
  30: {
    name: "冬瓜 (小段)",
    img: "https://i.imgur.com/BK0S2xg.png", // 沿用
    length: "27.0 cm (總身長約38.0 cm)",
    weight: "1350 g (1.35 公斤)",
  },
  31: {
    name: "釋迦 (大顆)",
    img: "https://i.imgur.com/0KQEBYd.png", // 沿用
    length: "28.0 cm (總身長約40.0 cm)",
    weight: "1600 g (1.6 公斤)",
  },
  32: {
    name: "高麗菜 (大顆)",
    img: "https://i.imgur.com/DJzvXj7.png", // 沿用
    length: "29.0 cm (總身長約42.0 cm)",
    weight: "1800 g (1.8 公斤)",
  },
  33: {
    name: "木瓜 (大顆)",
    img: "https://i.imgur.com/cpYXTxA.png", // 沿用
    length: "30.0 cm (總身長約43.0 cm)",
    weight: "2000 g (2 公斤)",
  },
  34: {
    name: "哈密瓜",
    img: "https://i.imgur.com/NYLoj1R.png", // 沿用
    length: "32.0 cm (總身長約44.0 cm)",
    weight: "2280 g (2.28 公斤)",
  },
  35: {
    name: "甜瓜 (整顆)",
    img: "https://i.imgur.com/nNWRqsu.png", // 沿用
    length: "33.0 cm (總身長約45.0 cm)",
    weight: "2500 g (2.5 公斤)",
  },
  36: {
    name: "小玉西瓜",
    img: "https://i.imgur.com/BK0S2xg.png", // 沿用
    length: "34.0 cm (總身長約46.0 cm)",
    weight: "2750 g (2.75 公斤)",
  },
  37: {
    name: "大白菜 (一顆)",
    img: "https://i.imgur.com/Y4wYwUf.png", // 沿用
    length: "35.0 cm (總身長約47.0 cm)",
    weight: "2950 g (2.95 公斤)",
  },
  38: {
    name: "南瓜 (小型)",
    img: "https://i.imgur.com/Y4wYwUf.png", // 沿用
    length: "35.0 cm (總身長約47.0 cm)",
    weight: "3100 g (3.1 公斤)",
  },
  39: {
    name: "西瓜 (中型)",
    img: "https://i.imgur.com/Y4wYwUf.png", // 沿用
    length: "36.0 cm (總身長約48.0 cm)",
    weight: "3250 g (3.25 公斤)",
  },
  40: {
    name: "西瓜 (大顆)",
    img: "https://i.imgur.com/Y4wYwUf.png", // 沿用
    length: "37.0~38.0 cm (總身長約48.0~50.0 cm)",
    weight: "3400 g (3.4 公斤)",
  },
};

// === 2️⃣ 假設你的資料庫會給週 & 天 ===
const currentWeek = ref(12); // 請替換成後端回傳週數
const currentDay = ref(3); // 請替換成後端回傳天數

// === 3️⃣ 依照週數取得寶寶資料 ===
const currentData = ref({
  name: "",
  img: "",
  length: "",
  weight: "",
});

onMounted(() => {
  currentData.value = babySizeMap[currentWeek.value] || {
    name: "未知",
    img: "",
    length: "N/A",
    weight: "N/A",
  };
});
</script>

<style scoped>
.maternal-dashboard {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
}

.main-content-container {
  display: flex;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
}

.left-panel,
.right-panel {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
}

/* --- 左側面板樣式 --- */
.left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 600px;
  padding: 20px 10px 20px 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-placeholder {
  /* 讓圖、文字和尺寸資訊區塊都能垂直居中 */
  flex-grow: 1;
  width: fit-content;
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  justify-content: center;
  align-items: center;
  background-color: none;
  border-radius: 15px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.placeholder-icon {
  width: 100px;
  height: 100px;
}

.pregnancy-tracker {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
  
}

.divider {
  margin: 0 10px;
  color: #999;
}

.week-day-text {
  border-bottom: 2px solid #006aa8; /* 底部綠色線條 */

}

/* 寶寶尺寸資訊區塊的樣式 */
.baby-size-info {
  padding: 10px 20px;
  border: none;
  display: flex;
  flex-direction: column; /* 垂直排列長度和重量 */
  gap: 8px;
  text-align: left;
  width: 90%; /* 限制寬度 */
  max-width: 250px;
  font-size: 16px;
}

.size-item {
  margin: 0;
  display: flex;
  justify-content:flex-start; /* 文字靠左 */
  align-items: center;
  width: 100%;
}

.size-item strong {
  margin-left: 10px;
  color: #57aee2;
  font-weight: 600;
}

.label {
  color: #666;
  font-weight: normal;
}

/* 水果示意圖 */
.baby-fruit-img {
  width:fit-content;
  height:fit-content;
  object-fit: contain;
  border-radius: 15px;
}

.fruit-text {
  margin-top: 30px;
  font-size: 20px; /* 放大文字 */
  color: #333;
  text-align: center;
}

.fruit-text strong {
  color: #006aa8; /* 強調水果/蔬菜名稱，使用紅色系 */
  font-weight: 700;
}

/* --- 右側面板樣式 --- */
.right-panel {
  display: flex;
  flex-direction: column;
  height: 570px;
  padding: 0;
}

.calendar-section {
  flex: 1;
  width: 100%;
  min-width: 0; /* ⬅⬅⬅ 讓手機可縮小 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
}

.calendar-section > * {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 15px;
}

.placeholder-text {
  text-align: center;
  color: #999;
  padding-top: 50px;
  font-style: italic;
}

/* ======================== */
/* 📱 手機版（寬度 ≤ 480px） */
/* ======================== */
@media (max-width: 480px) {
  .maternal-dashboard {
    padding: 10px;
  }

  .main-content-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  /* 左側改成自動高度，內容垂直排列 */
  .left-panel {
    height: auto;
    padding: 15px;
  }

  .fruit-text {
    font-size: 16px;
    margin-top: 10px;
  }

  .baby-size-info {
    font-size: 14px;
    max-width: 220px;
  }

  .baby-fruit-img {
    width: 250px;
    height: 200px;
  }

  .pregnancy-tracker {
    font-size: 22px;
    margin-top: 10px;
  }

  /* 右側 Calendar */
  .right-panel {
    padding: 0;
  }

  .calendar-section {
    min-width: unset !important;
    width: 100% !important;
  }

  .calendar-section > * {
    padding: 10px;
  }
}

/* ================================= */
/* 📱 平板（481px ～ 768px） */
/* ================================= */
@media (min-width: 481px) and (max-width: 768px) {
  .maternal-dashboard {
    padding: 10px;
  }

  .main-content-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .left-panel {
    height: auto;
    padding: 15px
  }
  .right-panel {
    padding: 0;
  }
  .calendar-section {
    width: 100% !important;
  }

  .calendar-section > * {
    padding: 10px;
  }
}

/* ================================= */
/* 💻 小筆電（769px ～ 1024px） */
/* ================================= */
/* @media (min-width: 769px) and (max-width: 1024px) */
 @media (max-width: 850px) {
  .main-content-container {
    flex-direction: column;
    flex-wrap: wrap;
    padding: 15px;
  }

  .left-panel {
    order: 1;
    width: 98%; /* 確保佔滿整個容器寬度 */
    margin-bottom: 20px; /* 增加與下方日曆的間距 */
  }

  .right-panel {
    order: 2;
    width: 100%;
  }
}

/* 桌機/大筆電（1025px 以上） */
@media (min-width: 1025px) {
  .calendar-section {
    min-width: 750px; /* ⬅ 桌機才需要 750px */
  }

  .left-panel {
    height: auto !important;
  }

  .right-panel {
    height: auto !important;
  }
}

</style>