<template>
  <div class="assessment-page">
    
    <div class="layout-container">
      
      <aside class="sidebar">
        <ul class="menu-list">
          <li v-for="item in menuItems" :key="item.path">
            <router-link 
              :to="item.path" 
              class="menu-link"
              active-class="active"
            >
              {{ item.title }}
            </router-link>
          </li>
        </ul>
      </aside>

      <main class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定義左側選單項目
const menuItems = ref([
  { title: '問卷說明', path: '/self-assessment/instructions' },
  { title: '孕婦產前健康照護衛教指導紀錄表', path: '/self-assessment/prenatal' },
  { title: '愛丁堡產後憂鬱量表', path: '/self-assessment/depression' },
  { title: '歷史填寫紀錄', path: '/self-assessment/history' }
]);
</script>

<style scoped>
.assessment-page {
  width: 65%;
  max-width: 1400px; /* 增加最大寬度限制，避免在超大螢幕太寬 */
  margin: 0 auto;
  padding: 40px 20px;
}

.layout-container {
  display: flex;
  gap: 50px; /* 左右區塊間距 */
  min-height: 600px;
}

/* --- 左側側邊欄樣式 --- */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  border-bottom: 2px solid #e0e0e0; /* 分隔線 */
}

.menu-link {
  display: block;
  padding: 20px 0;
  text-decoration: none;
  color: #555;
  font-size: 18px;
  line-height: 1.5;
  transition: color 0.3s;
  text-align: center;
}

.menu-link:hover {
  color: #3498db;
}

/* Vue Router 自動加上的 Active Class */
.menu-link.active {
  color: #3498db;
  font-weight: bold;
}

/* --- 右側內容區框架 --- */
.content-wrapper {
  flex-grow: 1;
}

/* 簡單的過場動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- 平板 (iPad Air, iPad Pro 等，寬度 <= 1024px) --- */
@media (max-width: 1024px) {
  .assessment-page {
    width: 90%; /* 寬度放寬 */
    padding: 30px 0;
  }

  .layout-container {
    flex-direction: column; /* 改為上下排列 */
    gap: 20px;
  }

  /* 側邊欄變為頂部選單 */
  .sidebar {
    width: 100%;
    overflow-x: auto; /* 允許橫向滑動 */
    background: #fff;
    padding-bottom: 10px;
    /* 隱藏捲軸但保留功能 (Chrome, Safari) */
    scrollbar-width: none; 
  }
  .sidebar::-webkit-scrollbar {
    display: none;
  }

  .menu-list {
    display: flex; /* 選單變橫排 */
    border-bottom: 2px solid #e0e0e0; /* 整個選單下方加線 */
  }

  .menu-list li {
    border-bottom: none; /* 移除原本每個項目的底線 */
    flex-shrink: 0; /* 防止文字擠壓 */
  }

  .menu-link {
    padding: 15px 20px;
    font-size: 16px;
    white-space: nowrap; /* 文字不換行 */
    border-bottom: 3px solid transparent; /* 預留 active 樣式的空間 */
  }

  /* 平板手機版 Active 樣式改為底線標示 */
  .menu-link.active {
    color: #3498db;
    border-bottom-color: #3498db; 
    background-color: rgba(52, 152, 219, 0.05);
  }
}

/* --- 手機 (iPhone 12/14 Pro/Max 等，寬度 <= 768px) --- */
@media (max-width: 768px) {
  .assessment-page {
    width: 100%; /* 手機版滿版 */
    padding: 10px;
  }
  
  .layout-container {
    min-height: auto; /* 手機版不強制高度 */
  }

  .menu-link {
    font-size: 15px;
    padding: 12px 15px;
  }
}
</style>