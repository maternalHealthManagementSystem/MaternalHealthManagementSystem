<template>
  <AssessmentPanel title="歷史填寫紀錄">  
    <ul v-if="records.length > 0" class="history-list">
      <li v-for="record in records" :key="record.id" class="history-item" @click="viewRecord(record)">
        <div class="item-content">
          <span class="record-title">{{ record.title }}</span>
          <span class="record-date">{{ formatTime(record.id) }}</span>
        </div>
      </li>
    </ul>

    <div v-else class="empty-state">
      <p>目前尚無填寫紀錄</p>
    </div>
  </AssessmentPanel>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import AssessmentPanel from '../components/AssessmentPanel.vue';

const router = useRouter();
const records = ref([]);

// 時間格式化函式
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  // 將 timestamp (毫秒) 轉為 Date 物件
  const date = new Date(timestamp);
  
  // 轉為中文格式 
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // hour12: false // 使用 24 小時制
  });
};

// 當元件掛載時，從 localStorage 抓取資料
onMounted(() => {
  const storedData = localStorage.getItem('assessment_history');
  if (storedData) {
    records.value = JSON.parse(storedData);
  }
});

// 點擊紀錄後查看詳細內容
const viewRecord = (record) => {
  // 跳轉到詳細頁面，並帶上 record.id
  // router.push({
  //   name: 'HistoryDetail',
  //   params: { id: record.id }
  // });
  router.push(`/self-assessment/history/${record.id}`)
};
</script>

<style scoped>
/* --- 列表樣式 --- */
.history-list {
  list-style: none;
  padding: 0 20px; /* 左右留白 */
  margin: 0;
}

.history-item {
  border-bottom: 1px solid #cbd5e0; /* 分隔線 */
  padding: 15px 0;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
}

/* Hover 效果：讓使用者知道可以點擊 */
.history-item:hover {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  padding-left: 10px; /* 微微向右移 */
  padding-right: 10px;
}

.history-item:last-child {
  border-bottom: none; /* 最後一項不要底線 */
}

/* 列表內容佈局：左右對齊 */
.item-content {
  display: flex;
  justify-content: space-between; /* 標題靠左，日期靠右 */
  align-items: center;
}

.record-title {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
  text-decoration: underline; 
  text-underline-offset: 4px;
}

.record-date {
  font-size: 14px;
  color: #5a6b7c; /* 深灰藍色，稍微淡一點 */
  font-family: monospace; /* 讓數字寬度一致，看起來比較整齊 */
  background-color: #7f9ab0; /* 日期的深色背景塊 */
  color: white;
  padding: 2px 8px;
  border-radius: 2px;
}

/* 空狀態樣式 */
.empty-state {
  text-align: center;
  color: #888;
  margin-top: 50px;
  font-size: 16px;
}

/* =========================================
   iPad Air & Tablet (寬度 <= 1024px)
   ========================================= */
@media (max-width: 1024px) {
  .history-list {
    padding: 0;
  }
  
  /* 平板上維持左右排列，但縮小間距 */
  .history-item {
    padding: 20px 10px;
  }
  
  .record-title {
    font-size: 16px;
  }
}

/* =========================================
   iPhone 12/14 Pro/Max (手機版 <= 768px)
   ========================================= */
@media (max-width: 768px) {
  .history-list {
    padding: 0;
  }

  /* 卡片式外觀 */
  .history-item {
    background-color: white;
    border: 1px solid #f1f5f9;
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);
    margin-bottom: 12px;
    border-radius: 10px;
    padding: 15px;
    transition: transform 0.1s;
  }
  
  .history-item:active {
    transform: scale(0.98);
    background-color: #f8fafc;
  }

  /* 內容容器：保持左右排列 (左邊文字群，右邊箭頭) */
  .item-content {
    display: flex;
    justify-content: space-between; /* 文字靠左，箭頭靠右 */
    align-items: center;            /* 垂直置中 */
  }

  /* 文字群組：改為垂直排列 */
  .text-group {
    display: flex;
    flex-direction: column; /* 垂直堆疊：標題在上，日期在下 */
    gap: 6px;               /* 兩行之間的間距 */
    flex: 1;                /* 佔滿剩餘寬度 */
    overflow: hidden;       /* 防止內容撐開 */
  }

  /* 標題樣式：第一行 */
  .record-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    line-height: 1.3;
    
    /* 若標題太長，強制單行省略  */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  /* 日期時間樣式 */
  .record-date {
    font-size: 13px;
    color: #94a3b8;
    background-color: transparent; 
    padding: 0;
    
    /* 讓日期時間在同一行 */
    display: flex;
    align-items: center;
  }
}
</style>
