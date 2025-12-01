<template>
  <div class="maternal-dashboard">
    <div class="main-content-container">
      <div class="left-panel">
        <div class="image-placeholder">
          <svg class="placeholder-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM5 19l3-4 2 2 4-5 6 8H5z"
            />
          </svg>
        </div>
        <div class="pregnancy-tracker">
          <span class="week-day-text">週</span>
          <span class="divider">/</span>
          <span class="week-day-text">天</span>
        </div>
      </div>

      <div class="right-panel">
        <div class="calendar-title">行事曆</div>
        <div id="calendar-content">
          <p class="placeholder-text">此處應顯示互動式行事曆內容。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

// 通知 Modal 邏輯已移至 App.vue
onMounted(() => {
  console.log("Home page loaded.");
});
</script>

<style scoped>
/* 頁面整體佈局和樣式 */
.maternal-dashboard {
  padding: 20px;
  background-color: #f8f9fa; /* 輕微的背景色 */
  min-height: calc(100vh - 60px); /* 假設頂部有導航欄 */
  display: flex;
  justify-content: center;
}

.main-content-container {
  display: grid;
  grid-template-columns: 1fr 2fr; /* 左側佔 2/3，右側佔 1/3 */
  gap: 20px; /* 左右間隔 */
  max-width: 1200px; /* 內容最大寬度 */
  width: 100%;
}

/* 左右面板通用樣式 */
.left-panel,
.right-panel {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

/* --- 左側面板樣式 --- */
.left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 570px; /* 設定一個固定高度或依賴內容 */
  padding: 10px 10px 20px 10px; /* 底部留白多一點給文字 */
}

.image-placeholder {
  flex-grow: 1; /* 佔據剩餘空間 */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0; /* 灰色佔位背景 */
  border-radius: 4px;
  margin-bottom: 20px;
}

.placeholder-icon {
  width: 100px;
  height: 100px;
  color: #a0a0a0; /* 圖標顏色 */
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
  border-bottom: 2px solid #5cb85c; /* 底部綠色線條 */
  padding-bottom: 5px;
}

/* --- 右側面板樣式 --- */
.right-panel {
  display: flex;
  flex-direction: column;
  height: 570px; /* 與左側保持一致的高度 */
  padding: 0; /* 內部元素自己控制邊距 */
}

.calendar-title {
  padding: 15px 20px;
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f7f7f7; /* 標題輕微背景色 */
  text-align: center;
}

#calendar-content {
  flex-grow: 1; /* 佔據剩餘空間 */
  padding: 20px;
  overflow-y: auto;
}

.placeholder-text {
  text-align: center;
  color: #999;
  padding-top: 50px;
  font-style: italic;
}

/* 媒體查詢：適用於較小的螢幕 */
@media (max-width: 768px) {
  .main-content-container {
    grid-template-columns: 1fr; /* 小螢幕時變成單欄佈局 */
  }

  .left-panel,
  .right-panel {
    height: auto;
    min-height: 300px;
  }
}
</style>
