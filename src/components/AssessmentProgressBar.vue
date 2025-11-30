<template>
  <div class="progress-widget">
        <div class="progress-text">
            填寫進度 : <span class="progress-num">{{ completionRate }} %</span>
        </div>
        <div class="progress-track">
            <div class="progress-fill" :style="{ width: completionRate + '%' }"></div>
        </div>
    </div>
</template>

<script setup>
defineProps({
  completionRate: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
/* --- 進度條組件 (右上角) --- */
.progress-widget {
    position: absolute; /* 絕對定位 */
    right: 25px;           /* 靠右對齊 */
    top: 15px;          
    width: 160px;       /* 設定固定寬度 */
    text-align: center;
}

.progress-text {
    font-size: 16px;
    font-weight: 600;
    color: #4a5568;     
    margin-bottom: 8px; /* 文字與條的間距 */
    letter-spacing: 1px;
}

.progress-num {
    margin-left: 5px;
    font-weight: bold;  
}

/* 進度條軌道 (淺灰底) */
.progress-track {
    width: 100%;
    height: 12px;         
    background-color: #dbe2e8; 
    border-radius: 6px;    
    overflow: hidden;
}

/* 進度條填充 (深灰藍) */
.progress-fill {
    height: 100%;
    background-color: #4f6070; /* 截圖中的深灰藍色 */
    border-radius: 6px;     /* 圓角 */
    transition: width 0.5s ease; /* 平滑動畫 */
}

/* --- RWD 手機版適配 --- */
@media (max-width: 768px) {
    /* 手機版取消絕對定位，改為置中 */
    .progress-widget {
        position: static;
        width: 100%;
        margin-bottom: 15px;
    }
}
</style>
