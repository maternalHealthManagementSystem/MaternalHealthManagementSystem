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
  /* max-width: 1200px; */
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
</style>
