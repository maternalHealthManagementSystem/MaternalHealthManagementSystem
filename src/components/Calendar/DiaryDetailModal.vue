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
          <div class="meta">
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
          </div>
          </div>
            <!-- 底部按鈕 -->
            <div class="modal-footer">
              <button class="btn-delete" @click="deleteDiary">刪除日記</button>
              <button class="btn-edit" @click="editDiary">編輯</button>
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
  max-width: 600px;
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
  font-size: 22px;
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
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);  
  color: #333;
}

.close-btn:active {
  transform: scale(0.95);
}

/* 內容區 */
.modal-body {
  padding: 20px;
  padding-top:15px;
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
  line-height: 1.2;
}

.diary-title span{
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
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
  flex-shrink: 0;
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
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
  font-size: 15px;
  margin-bottom: 5px;
  justify-content: center;
  text-align: center;
}

.meta-item {
  margin-bottom: 15px;
  justify-content: center;
  text-align: center;
  font-size: 15px
}

.meta-label  {
  color: #999;
}

.meta-value {
  color: #666;
  font-weight: 500;
  margin-right: 5px;
}

/* 底部按鈕 */
.modal-footer {
  display: flex;
  gap: 10px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
  padding: 20px;
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

/* 平板版（1024px 以下）*/
/* @media (max-width: 1024px) {
  .modal-container {
    max-width: 700px;
    border-radius: 10px;
  }

  .modal-header {
    padding: 18px;
  }

  .modal-body {
    padding: 20px;
  }

  .diary-title h1 {
    font-size: 24px;
  }

  .diary-image img {
    max-height: 350px;
  }
  .modal-footer {
    padding: 20px;
  }
} */
/* 小平板 / 大手機樣式 (Max-width: 820px) */
/* @media (max-width: 820px) {
  .modal-container {
    max-width: 85vw;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-body {
    padding: 20px;
  }
  
  .diary-title h1 {
    font-size: 26px;
  }
  
  .diary-image img {
    max-height: 300px;
  }

  .modal-footer {
    padding: 16px;
  }
} */
/* 手機版（600px 以下） */
/* @media (max-width: 600px) {
  .modal-overlay {
    padding: 0; 
  }
  .modal-container {
    max-width: 500px; 
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-header {
    padding: 12px 15px; 
  }
  
  .modal-title {
    font-size: 110%; 
  }

  .close-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .modal-body {
    padding: 15px;
  }

  .diary-title {
    flex-wrap: wrap; 
    gap: 8px;
  }
  
  .diary-title h1 {
    font-size: 24px; 
    margin: 5px 0;
    order: 1; 
    flex-basis: 100%; 
  }
  
  .diary-title span {
    font-size: 15px;
    order: 2; 
  }
  
  .diary-date {
    margin-top: 5px;
    font-size: 15px;
  }

  .diary-image {
    margin-bottom: 15px;
  }
  .diary-image img {
    max-height: 250px;
  }

  .diary-content {
    font-size: 15px;
  }
  
  .diary-meta {
    font-size: 14px;
  }

  .modal-footer {
    flex-direction: column;
    gap: 8px; 
    padding: 10px 15px;
  }
  
  .btn-delete,
  .btn-edit {
    padding: 10px; 
    font-size: 14px;
  }
} */
 /* iPhne 12 Pro  */
@media (max-width: 400px){
  .modal-overlay {
    padding: 0; 
  }
  
  .modal-container {
    max-width: 500px; 
    max-height: 100vh; 
    border-radius: 0;
  }
  
  .modal-header {
    padding: 18px;
  }

  .modal-title {
    font-size: 120%; 
  }

  .modal-body {
    padding: 20px;
  }
  .close-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .modal-body {
    padding: 20px;
  }
  
  .diary-title h1 {
    font-size: 24px; 
    margin: 5px 0;
    order: 1; 
  }
  
  .diary-title span {
    font-size: 15px;
    order: 2; 
  }
  .diary-date{
    margin-top: 15px;
  }
  .date-icon,
  .date-text{
    font-size: 20px;
  }

  .diary-image {
    margin-bottom: 15px;
  }
  .diary-image img {
    max-height: 100%;
  }

  .diary-content {
    font-size: 18px;
  }
  
  .diary-meta,
  .meta-item{
    font-size: 16px;
  }
  .meta{
    margin-bottom: 150px;
  }

  .modal-footer {
    flex-direction: column;
    gap: 8px; 
  }
  .btn-cancel,
  .btn-save {
    font-size: 16px;
    justify-content: center;
    text-align: center;
  }
}
/* iPhne 14 Pro Max */
@media(min-width: 400px) and (max-width: 450px){
 .modal-overlay {
    padding: 0; 
  }
  
  .modal-container {
    max-width: 500px; 
    max-height: 100vh; 
    border-radius: 0;
  }
  
  .modal-header {
    padding: 18px;
  }

  .modal-title {
    font-size: 120%; 
  }

  .modal-body {
    padding: 20px;
  }
  .close-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .modal-body {
    padding: 20px;
  }
  
  .diary-title h1 {
    font-size: 26px; 
    margin: 10px 0;
    order: 1; 
  }
  
  .diary-title span {
    font-size: 15px;
    order: 2; 
  }
  .diary-date{
    margin-top: 20px;
  }
  .date-icon,
  .date-text{
    font-size: 20px;
  }

  .diary-image {
    margin-bottom: 15px;
  }
  .diary-image img {
    max-height: 100%;
  }

  .diary-content {
    font-size: 18px;
  }
  
  .diary-meta,
  .meta-item{
    font-size: 18px;
  }
  .meta{
    margin-bottom: 170px;
  }

  .modal-footer {
    flex-direction: column;
    gap: 8px; 
  }
  .btn-cancel,
  .btn-save {
    font-size: 18px;
    justify-content: center;
    text-align: center;
  }
}

/* iPad Air*/
@media (min-width: 750px) and (max-width: 820px){
  .modal-overlay {
    padding: 0; 
  }
  
  .modal-container {
    max-width: 630px; 
    max-height: 85vh; 
    border-radius: 10px;
  }
  
  .modal-header {
    padding: 25px;
  }

  .modal-title {
    font-size: 150%; 
  }

  .modal-body {
    padding: 20px;
  }
  .close-btn {
    width: 40px;
    height: 40px;
    font-size: 30px;
  }

  .modal-body {
    padding: 25px;
  }
  
  .diary-title h1 {
    font-size: 32px; 
    margin: 10px 0;
    order: 1; 
  }
  
  .diary-title span {
    font-size: 20px;
    order: 2; 
  }
  .diary-date{
    margin-top: 20px;
  }
  .date-icon,
  .date-text{
    font-size: 25px;
  }

  .diary-image {
    margin-bottom: 15px;
  }
  .diary-image img {
    max-height: 100%;
  }

  .diary-content {
    font-size: 25px;
  }
  
  .diary-meta,
  .meta-item{
    font-size: 22px;
  }
  .meta{
    margin-bottom: 100px;
  }

  .modal-footer {
    flex-direction: column;
    gap: 8px; 
  }
  .btn-cancel,
  .btn-save {
    font-size: 18px;
    justify-content: center;
    text-align: center;
  }
}
</style>
