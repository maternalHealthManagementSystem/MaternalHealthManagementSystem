eventdatailmodel
<template>
  <!-- 遮罩層 -->
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click="closeModal">
      <!-- 彈窗內容 -->
      <div class="modal-container" @click.stop>
        <!-- 標題列 -->
        <div class="modal-header">
          <h3 class="modal-title">行程詳細資訊</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <!-- 內容 -->
        <div class="modal-body">
          <!-- 標題 -->
          <div class="event-title">
            <h1>{{ event.title }}</h1>
            <span class="event-type-badge" :class="`type-${event.type}`">
              {{ getEventTypeText(event.type) }}
            </span>
          </div>

          <!-- 詳細資訊 -->
          <div class="event-details">
            <!-- 日期時間 -->
            <div class="detail-item">
              <div class="detail-label">📅日期時間</div>
              <div class="detail-content">
                <div class="datetime-info">
                  <span class="date-text">{{ formatDate(event.startDate) }}</span>
                  <div class="time-range">
                    <span>{{ formatTimeDisplay(event.startTime) }}</span>
                    <span class="separator">-</span>
                    <span>{{ formatTimeDisplay(event.endTime) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 地點 -->
            <div class="detail-item" v-if="event.location">
              <div class="detail-label">📍地點</div>
              <div class="detail-content">
                <div class="location-info">
                  <span>{{ event.location }}</span>
                </div>
              </div>
            </div>

            <!-- 時間軸視覺化 -->
            <div class="detail-item">
              <div class="detail-label">🕛時間軸</div>
              <div class="detail-content">
                <div class="timeline">
                  <div 
                    v-for="hour in timelineHours" 
                    :key="hour.value"
                    class="timeline-row"
                    :class="{ highlight: hour.isInRange }"
                  >
                    <span class="time-label">{{ hour.label }}</span>
                    <div class="timeline-bar" :class="{ active: hour.isInRange }">
                      <div v-if="hour.isEventStart" class="event-block">
                        <span>{{ event.title }}</span>
                        <span>{{event.startTime }} – {{ event.endTime }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 備註 -->
            <div class="detail-item" v-if="event.description">
              <div class="detail-label">📑備註</div>
              <div class="detail-content">
                <p class="description-text">{{ event.description }}</p>
              </div>
            </div>

           <!-- 地圖 -->
          <div class="detail-item" v-if="event.location">
            <div class="detail-label">🗺️位置</div>
            <div class="detail-content">
              <!-- <div v-if="!mapLoaded" class="map-placeholder">
                <span class="map-icon">🗺️</span>
                <p>地圖載入中...</p>
              </div> -->
              <div ref="mapContainer" class="map-container"></div>
            </div>
          </div>
          </div>
        </div>

        <!-- 底部按鈕 -->
        <div class="modal-footer">
          <button class="btn-delete" @click="deleteEvent">刪除行程</button>
          <button class="btn-edit" @click="editEvent">編輯</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object,
    default: () => ({
      id: '',
      title: '',
      type: '',
      startDate: '',
      startTime: '',
      endTime: '',
      location: '',
      description: ''
    })
  }
})

// Emits
const emit = defineEmits(['close', 'delete', 'edit'])

// 響應式數據
const activeTab = ref('view')

  // 時間軸計算
const timelineHours = computed(() => {
  if (!props.event.startTime || !props.event.endTime) {
    return []
  }

  // 解析開始和結束時間
  const startTime = parseTime(props.event.startTime)
  const endTime = parseTime(props.event.endTime)

  // 計算顯示範圍（前後各加1小時）
  const displayStart = Math.max(0, startTime - 1)
  const displayEnd = Math.min(24, endTime + 1)

  const hours = []
  for (let hour = displayStart; hour <= displayEnd; hour++) {
    const isInRange = hour >= startTime && hour <= endTime
    const isEventStart = hour === startTime

    hours.push({
      value: hour,
      label: formatHourLabel(hour),
      isInRange: isInRange,
      isEventStart: isEventStart
    })
  }

  return hours
})

// 解析時間字串 (如 "10:00" -> 10)
function parseTime(timeStr) {
  if (!timeStr) return 0
  const parts = timeStr.split(':')
  return parseInt(parts[0], 10)
}

// 格式化小時標籤
function formatHourLabel(hour) {
  if (hour === 0) return '午夜12時'
  if (hour === 12) return '中午12時'
  if (hour < 12) return `上午${hour}時`
  return `下午${hour - 12}時`
}

// 格式化時間顯示（加上上午/下午）
function formatTimeDisplay(timeStr) {
  if (!timeStr) return ''
  
  const hour = parseTime(timeStr)
  const parts = timeStr.split(':')
  const minute = parts[1] || '00'
  
  if (hour === 0) return `午夜12:${minute}`
  if (hour === 12) return `中午12:${minute}`
  if (hour < 12) return `上午${hour}:${minute}`
  return `下午${hour - 12}:${minute}`
}


// 關閉彈窗
function closeModal() {
  emit('close')
}

// 刪除行程
function deleteEvent() {
  if (confirm('確定要刪除此行程嗎？')) {
    emit('delete', props.event.id)
  }
}

// 編輯行程
function editEvent() {
  closeModal()
  emit('edit', props.event)
}

// 格式化日期
function formatDate(date) {
  if (!date) return ''
  return dayjs(date).format('YYYY 年 M 月 D 日')
}

// 取得事件類型文字
function getEventTypeText(type) {
  const typeMap = {
    'checkup': '產檢',
    'appointment': '預約',
    'reminder': '提醒',
  }
  return typeMap[type] || '其他'
}

// 地圖
const mapContainer = ref(null)
let map = null
let marker = null

function initMap(location) {
  if (!mapContainer.value || !location || !window.google) return

  // modal 關閉前如果有 map，先清理
  if (map) {
    marker?.setMap(null)
    map = null
    marker = null
  }

  map = new google.maps.Map(mapContainer.value, {
    center: { lat: 0, lng: 0 },
    zoom: 15
  })

  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address: location }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const pos = results[0].geometry.location
      map.setCenter(pos)

      marker = new google.maps.Marker({
        map,
        position: pos
      })
    } else {
      console.warn('無法取得地點經緯度', status)
    }
  })
}

// 監控 modal 是否顯示
watch(() => props.show, (isShown) => {
  if (isShown && props.event.location) {
    nextTick(() => initMap(props.event.location))
  } else {
    // modal 關閉時清理 map
    if (map) {
      marker?.setMap(null)
      map = null
      marker = null
    }
  }
})

// 當地點改變時重新載入地圖
watch(() => props.event.location, (newLoc) => {
  if (props.show && newLoc) nextTick(() => initMap(newLoc))
})

// 清理 map
onUnmounted(() => {
  if (map) {
    marker?.setMap(null)
    map = null
    marker = null
  }
})
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
  font-size: 18px;
  color: white;
  margin: 0;
  font-weight: 600;
  flex: 1;
  text-align: center;
  margin-top: 10px; 
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

/* 標題區 */
.event-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.event-title h1 {
  font-size: 26px;
  color: #333;
  margin: 10px 0;
  flex: 1;
  text-align: left;
}

.event-type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}

.type-checkup{
  background: #ff6b9d;
}

.type-appointment {
  background: #9c8ec9;
}

.type-other {
  background: #4fc3f7;
}

.type-reminder {
  background: #ffa726;
}

/* 詳細資訊項目 */
.detail-item {
  margin-bottom: 25px;
}

.detail-label {
  font-size: 17px;
  color: #4d4c4c;
  margin-bottom: 4fr;
  font-weight: 600;
  text-align: left;
}

.detail-content {
  font-size: 15px;
  color: #333;
}

/* 日期時間 */
.datetime-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-text {
  font-size: 16px;
  font-weight: 450;
  color: #666;
  justify-content: center;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 16px;
  justify-content: center;
}

.separator {
  color: #ccc;
}

/* 地點 */
.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  justify-content: center;
}

/* 時間軸  */
 .timeline {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
}

.timeline-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.timeline-row:last-child {
  margin-bottom: 0;
}

.time-label {
  font-size: 12px;
  color: #999;
  text-align: right;
}

.timeline-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  position: relative;
}

.timeline-bar.active {
  background: #ff6b9d;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.event-block {
  color: white;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-row.highlight {
  background: #fff;
  padding: 5px;
  border-radius: 8px;
  margin: 5px -5px;
}

.timeline-row.highlight .time-label {
  color: #666;
  font-weight: 500;
}


/* 地圖 */
.map-placeholder {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: #999;
}

.map-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

.map-placeholder p {
  margin: 0;
  font-size: 14px;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

/* 備註 */
.description-text {
  line-height: 1.6;
  color: #666;
  margin: 0;
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

  .event-title h2 {
    font-size: 20px;
  }

  .timeline-row {
    grid-template-columns: 70px 1fr;
    gap: 10px;
  }

  .time-label {
    font-size: 11px;
  }

  .event-bar-title {
    font-size: 12px;
  }

  .event-bar-time {
    font-size: 10px;
  }
}
</style>