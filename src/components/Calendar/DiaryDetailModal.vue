<template>
  <!-- 遮罩層 -->
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click="closeModal">
      <!-- 彈窗內容 -->
      <div class="modal-container" @click.stop>
        <!-- 標題列 -->
        <div class="modal-header">
          <h3 class="modal-title">日記內容</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <!-- 內容 -->
        <div class="modal-body">
            <!-- 標題 -->
            <div class="diary-title">
                <h1>{{ diary.title || '（今日日記）' }}</h1>
                <span class="diary-badge">日記</span>
            </div>

            <!-- 詳細資訊 -->
            <div class="diary-details">
            <!-- 日期 -->
            <div class="diary-date">
                <span class="date-icon">📅</span>
                <span class="date-text">{{ formatDate(diary.date) }}</span>
            </div>
                
            <!-- 內容 -->
            <div class="diary-content">
              <span class="date-icon">📑</span>
                <span v-if="diary.content">{{ diary.content }}</span>
                <span v-else class="empty-content">（還沒有輸入內容喔~）</span>
            </div>

            <!-- 圖片 -->
            <div v-if="diary.image" class="diary-image">
                <img :src="diary.image" alt="日記圖片" />
            </div>

            <!-- 建立時間 -->
            <div class="diary-meta">
                <span class="meta-label">建立時間：</span>
                <span class="meta-value">{{ formatDateTime(diary.createdAt) }}</span>
            </div>

            <!-- 只有在有更新時間時才顯示 -->
            <div v-if="diary.updatedAt" class="meta-item">
              <span class="meta-label">最後編輯：</span>
              <span class="meta-value">{{ formatDateTime(diary.updatedAt) }}</span>
            </div>

            <!-- 底部按鈕 -->
            <div class="modal-footer">
              <button class="btn-delete" @click="deleteDiary">刪除日記</button>
              <button class="btn-edit" @click="editDiary">編輯</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import dayjs from 'dayjs'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  diary: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['close', 'delete', 'edit'])

// 關閉彈窗
function closeModal() {
  emit('close')
}

// 刪除日記
function deleteDiary() {
  if (confirm('確定要刪除此日記嗎？')) {
    emit('delete', props.diary.id)
  }
}

// 編輯日記
function editDiary() {
  emit('edit', props.diary)
}

// 格式化日期
function formatDate(date) {
  if (!date) return ''
  return dayjs(date).format('YYYY年M月D日')
}

// 格式化日期時間
function formatDateTime(datetime) {
  if (!datetime) return ''
  return dayjs(datetime).format('YYYY/MM/DD HH:mm')
}
</script>

<style scoped>
/* 彈窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* 彈窗容器 */
.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* 標題列 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #5eb3e4 0%, #4a9fd4 100%);
}

.modal-title {
  font-size: 18px;
  color: white;
  margin: 0;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #fffcfc;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.close-btn:active {
  transform: scale(0.95);
}

/* 內容區 */
.modal-body {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
}

/* 標題 */
.diary-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.diary-title h1 {
  font-size: 26px;
  color: #333;
  margin: 10px 0;
  flex: 1;
  text-align: left;
}

.diary-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.diary-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-icon {
  font-size: 16px;
}

.date-text {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.diary-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: #4fc3f7;
}

/* 圖片 */
.diary-image {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.diary-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

/* 內容 */
.diary-content {
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding-bottom: 15px;
  padding-top:10px;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
}

.empty-content {
  color: #999;
  font-style: italic;
}

/* 元資料 */
.diary-meta {
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
  font-size: 15px;
}

.meta-item {
  margin-top: 3px;
  margin-bottom: 10px;
  padding-top: 5px;
}

.meta-label {
  color: #999;
}

.meta-value {
  color: #666;
}

/* 底部按鈕 */
.modal-footer {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.btn-delete,
.btn-edit {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete {
  background: white;
  color: #ff4757;
  border: 1px solid #ff4757;
}

.btn-delete:hover {
  background: #ff4757;
  color: white;
}

.btn-edit {
  background: #5eb3e4;
  color: white;
}

.btn-edit:hover {
  background: #4a9fd4;
}

/* 動畫效果 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-body {
    padding: 20px;
  }

  .diary-title {
    font-size: 20px;
  }

  .diary-image img {
    max-height: 300px;
  }
}
</style>