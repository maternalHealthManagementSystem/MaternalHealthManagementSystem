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
  transition: background-color 0.2s;
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

/* RWD 手機版調整 */
@media (max-width: 768px) {
  .item-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .record-date {
    font-size: 12px;
    align-self: flex-end; /* 手機版日期靠右下 */
  }
}
</style>