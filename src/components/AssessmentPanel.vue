<template>
  <div class="main-panel">
    
    <!-- 標題區塊 -->
    <div class="panel-header">
      <h2>{{ title }}</h2>
      <div class="header-line"></div>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>

    <!-- 捲動內容 -->
    <div class="scroll-content">
      <slot></slot>
    </div>

  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
});
</script>

<style scoped>
/* 共用主面板樣式 */
.main-panel {
  flex: 1;
  background-color: #e3e9ef;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  min-height: 600px;
  position: relative;
}

/* 標題 */
.panel-header {
  text-align: center;
  margin-bottom: 20px; /* 增加底部間距，避免進度條擠到標題 */
}

.panel-header h2 {
  color: #555;
  font-size: 24px;
  margin-bottom: 10px;
}

.header-line {
  height: 1px;
  background-color: #a0aec0;
  width: 90%;
  margin: 0 auto 10px auto;
}

.subtitle {
  color: #555;
  font-size: 16px;
}

/* 捲動內容區 */
.scroll-content {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
  max-height: 600px;
  /* 自訂捲軸 */
  scrollbar-width: thin;
  scrollbar-color: #a0aec0 #edf2f7;
}

/* --- RWD 調整 --- */
@media (max-width: 768px) {
  .main-panel {
    padding: 20px 15px; /* 手機版減少內距 */
    min-height: 400px; /* 手機版高度需求降低 */
  }

  .panel-header h2 {
    font-size: 20px; /* 標題字體縮小 */
  }

  .scroll-content {
    padding-right: 0; /* 手機版通常不需要右側留白給捲軸 */
    max-height: 500px;
  }
}
</style>
