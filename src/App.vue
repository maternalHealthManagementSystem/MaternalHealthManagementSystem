<template>
  <div id="app">
    <!-- 導航列 -->
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo 和標題 -->
        <div class="navbar-brand">
          <h1 class="app-title">孕產婦健康管理系統</h1>
        </div>

        <!-- 導航選單 -->
        <div class="navbar-menu">
          <router-link to="/" class="nav-item">首頁</router-link>
          <router-link to="/Prenatal-checkup" class="nav-item">產檢資料專區</router-link>
          <router-link to="/HE-information" class="nav-item">衛教資訊專區</router-link>
          <router-link to="/Postpartum" class="nav-item">產後專區</router-link>
          <router-link to="/Self-assessment" class="nav-item">自我評估專區</router-link>
          <router-link to="/Calendar-Diary" class="nav-item">孕育時光表</router-link>
        </div>

        <!-- 用戶區域 -->
        <div class="navbar-user">
          <button class="notification-btn" @click="showNotifications">
            <span class="notification-icon">🔔</span>
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </button>
          <button class="user-btn" @click="showUserMenu">
            <span class="user-icon">👤</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主要內容區域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 頁尾 (可選) -->
    <footer class="footer">
      <p>&copy; 孕產婦健康管理系統</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 通知數量
const unreadCount = ref(0)

// 顯示通知
function showNotifications() {
  console.log('顯示通知')
  // TODO: 實作通知功能
}

// 顯示用戶選單
function showUserMenu() {
  console.log('顯示用戶選單')
  // TODO: 實作用戶選單
}
</script>

<style>
/* 全域樣式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft JhengHei', 
               'PingFang TC', 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
  color: #333;
  /* overflow: hidden; */
}

#app {
  /* min-height: 100vh; */
  display: flex;
  flex-direction: column;
}

/* 導航列樣式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  border-bottom: 1px solid #e8eef3;
}

.navbar-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 10px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  width: 260px
}

.app-title {
  font-size: 26px;
  font-weight:800;
  color: #57aee2;
  letter-spacing: 1px;
  user-select: none;
}

.navbar-menu {
  display: flex;
  gap: 25px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  font-size: 20px;
  color: #5f6d7a;
  padding: 8px 22px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.25s ease;
  position: relative;
  white-space: nowrap;
  border-radius: 4px;
  text-decoration: none;
}

.nav-item:hover {
  background: #f0f0f0;
  color: #57aee2;
}

.nav-item.router-link-active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  margin: auto;
  width: 80%;
  height: 3px;
  border-radius: 2px;
  background: #57aee2;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 18px;
}

.notification-btn,
.user-btn {
  border: none;
  font-size: 20px;
  padding: 8px;
  position: relative;
  width: 42px;
  height: 42px;
  background: #f3f7fb;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.25s;
}

.notification-btn:hover,
.user-btn:hover {
  background: #e1eef8;
}

.notification-icon,
.user-icon {
  font-size: 22px;
}

.badge {
  position: absolute;
  top: 5px;
  right: 3px;
  background: #ff4d4f;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
  border-radius: 10px;
  font-weight: 700;
}

/* 主要內容區域 */
.main-content {
  flex: 1;
  width: 100%;
  padding: 20px;
  padding-top: 30px !important;
  margin-top: 20px; 
}

/* 頁尾 */
.footer {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 15px;
  text-align: center;
  color: #999;
  font-size: 18px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .navbar-container {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 20px;
  }

  .navbar-brand {
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }

  .navbar-menu {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .navbar-user {
    position: absolute;
    top: 15px;
    right: 20px;
  }

  .nav-item {
    font-size: 14px;
    padding: 6px 12px;
  }
}

@media (max-width: 768px) {
  .app-title {
    font-size: 18px;
  }

  .navbar-menu {
    gap: 2px;
  }

  .nav-item {
    font-size: 13px;
    padding: 6px 10px;
  }

  .main-content {
    padding: 15px;
  }
}

/* 通用按鈕樣式 */
.btn-primary {
  background: #5eb3e4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #4a9fd4;
}

.btn-secondary {
  background: #e0e0e0;
  color: #666;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>