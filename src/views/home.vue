<template>
  <div class="maternal-dashboard">
    <div class="main-content-container">
      <div class="left-panel">
        <div class="top-info-container">
          <p class="fruit-text" v-if="currentData.name">
            你的寶寶大約和 <strong>{{ currentData.name }}</strong> 一樣大
          </p>

          <div
            class="baby-size-info"
            v-if="currentData.length || currentData.weight"
          >
            <p class="size-item-length">
              <span class="label">平均長度:</span>
              <strong>{{ currentData.length }}</strong>
            </p>
            <p class="size-item-weight">
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
            :events="combinedCalendarData"
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
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import EventCalendar from "../components/Calendar/EventCalendar.vue";
import EventDetailModal from "../components/Calendar/EventDetailModal.vue";
import EventAddForm from "../components/Calendar/EventAddForm.vue";
import DiaryDetailModal from "../components/Calendar/DiaryDetailModal.vue";
import { useCalendarStore } from "../stores/calendarStore.js"; // 使用相對路徑避免別名問題
import dayjs from "dayjs";
import api from "../services/api.js";

const calendarStore = useCalendarStore();
const router = useRouter();

// 合併事件和日記（用於顯示在日曆上）
const combinedCalendarData = computed(() => {
  const ev = calendarStore.events || [];
  const di = calendarStore.diaries || [];
  
  return [
    ...ev.map(e => ({ ...e, isDiary: false })),
    ...di.map(d => ({ 
      ...d, 
      isDiary: true, 
      title: `${d.title}`,
      type: 'diary' 
    }))
  ];
});

const getLoggedInUserId = () => {
  const userJson = sessionStorage.getItem("user");
  if (userJson) {
    const user = JSON.parse(userJson);
    return user.user_id; // 確保與你 Login.vue 存入的 key 一致
  }
  return null;
};
const currentUserId = getLoggedInUserId();

onMounted(async () => {
  //await calendarStore.fetchAllData('U001');
  if (!currentUserId) {
    alert("登入逾時或尚未登入，請重新登入");
    route.push("/"); // 導回登入頁
    return;
  }

  await calendarStore.fetchAllData(currentUserId);

  if (router.query.date) {
    newDiary.value.date = router.query.date;
    currentMonth.value = dayjs(router.query.date);
  }

  if (router.query.editEventId) {
    const eventToEdit = calendarStore.events.find(e => e.id == router.query.editEventId);
    if (eventToEdit) {
      selectedEvent.value = { ...eventToEdit };
      showEditForm.value = true;
    }
  }
});

// 彈窗狀態
const showEventDetail = ref(false);
const showAddForm = ref(false);
const showDiaryDetail = ref(false);
const defaultAddDate = ref("");

// 選中的事件
const selectedEvent = ref({});

// 選中的日記
const selectedDiary = ref({});

// --- 函式處理 ---
onMounted(() => {
  console.log("Home page loaded.");
});

// 處理日曆事件點擊
function handleEventClick(event) {
  console.log("Home Page: Event Clicked", event);

  if (event.isDiary) {
    // 必須從 Store 中找到最新的完整日記資料，因為 event 可能是合併後的簡化版
    const fullDiary = calendarStore.diaries.find((d) => d.id === event.id);
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
  console.log("開啟新增行程表單");
  defaultAddDate.value = dayjs().format("YYYY-MM-DD");
  showAddForm.value = true;
}

// 處理新增新行程
function handleAddNewEvent(newEvent) {
  console.log("Home Page - 新增行程:", newEvent);
  calendarStore.addEvent(newEvent);
  showAddForm.value = false;
}

// 處理刪除事件 (行程)
function handleDeleteEvent(eventId) {
  console.log("Home Page - 刪除事件 ID:", eventId);
  calendarStore.deleteEvent(eventId);
  showEventDetail.value = false;
  alert("行程已刪除");
}

// 處理刪除日記
function handleDeleteDiary(diaryId) {
  console.log("Home Page - 刪除日記 ID:", diaryId);
  calendarStore.deleteDiary(diaryId);
  showDiaryDetail.value = false;
  alert("日記已刪除");
}

// 處理編輯行程 - 導航
function handleEditEvent(event) {
  console.log("Home Page - 編輯行程，導航至 PregnancyDiary");
  showEventDetail.value = false;
  router.push({
    name: "PregnancyDiary",
    query: {
      editEventId: event.id,
    },
  });
}

// 處理編輯日記 - 導航
function handleEditDiary(diary) {
  console.log("Home Page - 編輯日記，導航至 PregnancyDiary");
  showDiaryDetail.value = false;
  router.push({
    name: "PregnancyDiary",
    query: {
      editDiaryId: diary.id, // 使用不同的參數名稱區分行程和日記
      date: diary.date,
    },
  });
}

//------------------------
// 寶寶示意圖邏輯
//------------------------

const currentWeek = ref(0); 
const currentDay = ref(0); 
const currentData = ref({
  name: "讀取中...",
  img: "",
  length: "--",
  weight: "--",
});

// 1. 核心邏輯：用EDC計算週數和天數
function calculatePregnancyByLMP(lmpDate) {
  const today = dayjs().startOf("day");   
  const lmp = dayjs(lmpDate).startOf("day");

  const diffDays = today.diff(lmp, "day");// 計算從 LMP 到今天總共過了多少天

  if (diffDays < 0) { // 如果今天比 LMP 還早，表示還沒懷孕或日期錯誤
    currentWeek.value = 0;
    currentDay.value = 0;
    return;
  }
  // 超過 280 天通常代表已生產或過期妊娠，但邏輯上我們最高顯示 40 週
  const currentTotalDays = Math.min(diffDays, 280);

  currentWeek.value = Math.floor(currentTotalDays / 7);
  currentDay.value = currentTotalDays % 7;

  console.log(`LMP: ${lmpDate}, 目前已過: ${currentTotalDays} 天`);
}

// 2. 抓取水果資料
const fetchGrowthData = async (week) => {
  try {
    const targetWeek = Math.max(4, Math.min(40, week));
    const res = await api.get(`/api/growth/${targetWeek}`);
    
    if (res.data) {
      currentData.value = {
        name: res.data.fruit_name,
        length: res.data.baby_length,
        weight: res.data.baby_weight,
        img: res.data.growth_file_path 
      };
    }
  } catch (error) {
    console.error("抓取成長資訊失敗:", error);
  }
};

onMounted(async () => {
  const loginUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  console.log("登入使用者:", loginUser);

  if (!loginUser.user_id) return;

  try {
    const res = await api.get(`/api/profile/${loginUser.user_id}`);

    if (res.data && res.data.LMP) {
      calculatePregnancyByLMP(res.data.LMP);
      console.log("計算後週數:", currentWeek.value);

      await fetchGrowthData(currentWeek.value);
    } else {
      console.log("沒有lmp資料，無法計算週數");
    }
  } catch (error) {
    console.error("初始化首頁資料失敗:", error);
  }
});
</script>

<style scoped>
.maternal-dashboard {
  padding: 10px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
}

.main-content-container {
  display: flex;
  gap: 20px;
  height: fit-content;
  max-width: 1200px;
  width: 100%;
}

.left-panel,
.right-panel {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* --- 左側面板樣式 --- */
.left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px; /* 元素間距 */
  min-height: 600px; /* min-height 確保高度，但允許內容超出 */
  padding: 20px 10px 20px 10px; /* 上右下左 */
  flex-grow: 1;
}

.top-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.image-placeholder { 
  flex-grow: 0; 
  width: 100%;
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  justify-content: center;
  align-items: center;
  background-color: none;
  margin-bottom: 0; /* 確保底部沒有多餘的邊距推開 pregnancy-tracker */
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
  padding: 10px 20px; /* 上下左右 */
  border: none;
  display: flex;
  flex-direction: column; /* 垂直排列長度和重量 */
  gap: 10px;
  text-align: left;
  width: 100%; /* 限制寬度 */
  max-width: 300px;
  font-size: 18px;
}

.size-item-length,
.size-item-weight {
  margin: 0;
  display: flex;
  justify-content: flex-start; /* 文字靠左 */
  align-items: center;
  width: 100%;
}

.size-item-length strong,
.size-item-weight strong {
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
  max-width: 100%;
  height: auto;
  border-radius: 15px;
}

.fruit-text {
  margin-top: 30px;
  font-size: 20px; /* 放大文字 */
  color: #333;
  text-align: center;
}

.fruit-text p {
  font-weight: 600;
}

.fruit-text strong {
  color: #006aa8; /* 強調水果/蔬菜名稱，使用紅色系 */
  font-weight: 700;
}

/* --- 右側面板樣式 --- */
.right-panel {
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 0;
  flex-grow: 2;
}

.calendar-section {
  flex: 1;
  width: 100%;
  min-width: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

*,
*::before,
*::after {
  box-sizing: border-box; /* 讓 padding 和 border 包含在 width 內 */
}

/* =====================================
   📱 手機版：< 768px  → 上下排列
===================================== */
@media (max-width: 768px) {
  .main-content-container {
    flex-direction: column;
    gap: 15px;
  }

  .left-panel,
  .right-panel {
    width: 100%;
    padding: 15px;
  }

  .left-panel {
    height: auto;
  }

  .baby-fruit-img {
    width: 65%;
    height: auto;
  }

  .fruit-text {
    font-size: 18px;
  }

  .pregnancy-tracker {
    font-size: 28px;
    margin-bottom: 10px;
  }

  .baby-size-info {
    width: 100%;
    max-width: 100%; /* 讓它不要比 panel 還大 */
  }

  .calendar-section {
    padding: 0;
    box-shadow: none;
  }

  .calendar-section > * {
    padding: 10px;
  }
}

/* =====================================
   📟 平板版：768px ~ 1180px → 上下排列
===================================== */
@media (min-width: 768px) and (max-width: 1180px) {
  .main-content-container {
    flex-direction: column;
    gap: 20px;
  }

  .left-panel,
  .right-panel {
    width: 100%;
  }

  .left-panel {
    height: auto;
    padding: 20px;
    min-height: auto !important;
    justify-content: flex-start; 
    gap: 10px; /* 讓元素保持間距但不撐開 */
  }

  .size-item-length,
  .size-item-weight {
    width: 130%;
    font-size: 22px;
  }

  .baby-fruit-img {
    margin: 10px;
    height: auto;
  }

  .fruit-text{
    font-size: 30px;
  }

  .pregnancy-tracker {
    font-size: 35px;
    margin-bottom: 10px;
  }

  .calendar-section > * {
    padding: 15px;
  }

  .image-placeholder {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

</style>