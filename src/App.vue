<template>
  <!-- 載入 Flaticon CSS for icons (fi fi-sr-*) -->
  <link
    rel="stylesheet"
    href="https://cdn-uicons.flaticon.com/3.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
  />

  <div class="app-container font-inter">
    <!-- 登入頁不顯示導覽列 -->
    <header v-if="showNavbar" class="top-bar">
      <!-- 漢堡按鈕已移除 -->

      <div class="logo">孕產婦健康照護管理系統</div>

      <!-- 桌面版導覽列 - Desktop/Tablet Landscape Only -->
      <nav class="nav">
        <router-link to="/home">首頁</router-link>
        <router-link to="/prenatal">產檢紀錄專區</router-link>
        <div class="dropdown">
          <router-link class="dropbtn">衛教資訊專區 ⮟</router-link>
          <div class="dropdown-content">
            <router-link to="/education/pregnancy">孕期衛教資訊</router-link>
            <router-link to="/education/prenatal-checkup">產檢衛教資訊</router-link>
          </div>
        </div>

        <router-link to="/postpartum">產後專區</router-link>
        <router-link to="/self-assessment">自我評估專區</router-link>
        <router-link to="/Calendar-Diary">孕育時光表</router-link>
      </nav>

      <div class="icons-group">
        <!-- 通知圖標 - Desktop/Tablet Landscape Only -->
        <div
          class="notify-icon"
          @click="handleNotificationClick"
          aria-label="通知"
        >
          <i class="fi fi-sr-bell"></i>
          <span v-if="notificationCount > 0" class="notification-badge">
            {{ notificationCount > 99 ? "99+" : notificationCount }}
          </span>
        </div>

        <!-- Profile 圖標 (開啟右側邊欄) -->
        <div
          class="profile-icon"
          @click="openSidebar"
          aria-label="開啟個人資料側邊欄"
        >
          <!-- 如果有頭像就顯示頭像,沒有就顯示圖標 -->
          <img v-if="userAvatar" :src="userAvatar" class="avatar-preview" alt="使用者頭像" />
          <i v-else class="fi fi-sr-user"></i>
        </div>
      </div>
    </header>

    <!-- 顯示頁面內容 -->
    <div class="content-wrapper">
      <router-view />
    </div>

    <!-- Footer - 登入頁不顯示 -->
    <footer v-if="showNavbar" class="footer">
      <div class="footer-bottom">
        <div class="copyright">
          <p>
            &copy; {{ currentYear }} 孕產婦健康照護管理系統. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>

    <!-- Profile 側邊欄(右側滑出 - 統一行動版選單) -->
    <div v-if="showNavbar">
      <!-- 遮罩 -->
      <div
        v-if="isSidebarOpen"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>

      <!-- 側邊欄主體 -->
      <div class="sidebar" :class="{ open: isSidebarOpen }">
        <!-- 頂部使用者資訊 -->
        <div class="sidebar-header">
          <div class="avatar">
            <!-- 如果有上傳頭像就顯示,沒有就顯示預設圖標 -->
            <img v-if="userAvatar" :src="userAvatar" class="avatar-image" alt="使用者頭像" />
            <i v-else class="fi fi-sr-user" style="font-size: 30px"></i>
          </div>
          <div class="user-info">
            <h3>{{ currentUser.name }}</h3>
            <p>{{ currentUser.email }}</p>
          </div>
        </div>

        <!-- 行動版通知區塊 (點擊後開啟 Modal) -->
        <div
          class="mobile-notify"
          @click="
            () => {
              handleNotificationClick();
              closeSidebar();
            }
          "
          tabindex="0"
          role="button"
        >
          <div class="dot">
            <i class="fi fi-sr-bell" style="color: #57aee2"></i>
            <span
              v-if="notificationCount > 0"
              class="notification-badge-mobile"
            >
              {{ notificationCount > 99 ? "99+" : notificationCount }}
            </span>
          </div>
          <span class="txt">通知中心 ({{ notificationCount }} 則未讀)</span>
          <i class="fi fi-sr-angle-right ml-auto" style="color: #764ba2"></i>
        </div>

        <!-- 導覽列連結 -->
        <nav class="sidebar-nav-links">
          <router-link to="/home" @click="closeSidebar">首頁</router-link>
          <router-link to="/prenatal" @click="closeSidebar"
            >產檢紀錄專區</router-link
          >
          <router-link to="/education" @click="closeSidebar"
            >衛教資訊專區</router-link
          >
          <router-link to="/postpartum" @click="closeSidebar"
            >產後專區</router-link
          >
          <router-link to="/selftest" @click="closeSidebar"
            >自我評估專區</router-link
          >
          <router-link to="/timeline" @click="closeSidebar"
            >孕育時光表</router-link
          >
        </nav>

        <!-- 個人資料按鈕 (原 sidebar-menu) -->
        <div class="sidebar-menu">
          <button class="menu-btn" @click="goProfile">
            <i class="fi fi-sr-user" style="font-size: 18px"></i> 個人資料
          </button>
        </div>

        <!-- 登出按鈕 -->
        <div class="sidebar-footer">
          <button class="logout-btn" @click="logout">
            <i class="fi fi-sr-exit" style="font-size: 18px"></i> 登出
          </button>
        </div>
      </div>
    </div>

    <!-- 登出確認視窗 -->
    <div v-if="showLogoutConfirm" class="logout-modal-overlay">
      <div class="logout-modal">
        <!-- 上方標題列含 X 按鈕 -->
        <div class="logout-header">
          <span class="logout-title">是否登出</span>
          <button class="close-btn" @click="cancelLogout">&times;</button>
        </div>

        <!-- 下方按鈕 -->
        <div class="logout-actions">
          <button class="cancel-btn" @click="cancelLogout">取消</button>
          <button class="confirm-btn" @click="confirmLogout">確認</button>
        </div>
      </div>
    </div>

    <!-- 通知提醒 Modal -->
    <div v-if="showNotificationModal" class="modal-overlay modal-notification">
      <div class="modal-window">
        <span class="close" @click="closeNotificationModal">×</span>

        <h2>🔔 近期行程提醒</h2>
        <p>這裡放你的行程內容...</p>

        <h2>📝 待辦事項</h2>
        <p>這裡放你的待辦內容...</p>

        <button class="confirm-btn" @click="closeNotificationModal">
          確認
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

/* 基礎狀態 */

// 登入頁不顯示 Navbar 與 Footer
const showNavbar = computed(() => route.path !== "/");

// 取得當前年份
const currentYear = computed(() => new Date().getFullYear());

// 使用者資料
const currentUser = ref({
  name: "使用者姓名",
  email: "example@mail.com",
});

// 使用者頭像
const userAvatar = ref("");

// 載入使用者資料和頭像
const loadUserData = () => {
  const userData = localStorage.getItem("currentUser");
  if (userData) {
    currentUser.value = JSON.parse(userData);
  }

  const profileData = localStorage.getItem("userProfile");
  if (profileData) {
    const profile = JSON.parse(profileData);
    userAvatar.value = profile.avatar || "";
  }
};

onMounted(() => {
  loadUserData();
});

// 監聽 localStorage 變化 (當使用者在 profile 頁面上傳頭像時)
window.addEventListener('storage', (e) => {
  if (e.key === 'userProfile') {
    loadUserData();
  }
});

// 監聽路由變化,重新載入使用者資料 (處理同頁面更新的情況)
watch(() => route.path, () => {
  loadUserData();
});

// 認證狀態
const showLogoutConfirm = ref(false);

/* 側邊欄控制(Unified Menu / Profile)*/

const isSidebarOpen = ref(false);
const openSidebar = () => {
  // 每次開啟側邊欄時重新載入資料,確保顯示最新頭像
  loadUserData();
  isSidebarOpen.value = true;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

/* Navbar icons / 通知 Modal 控制*/

// 新增:通知 Modal 狀態
const showNotificationModal = ref(false);

const openNotificationModal = () => {
  showNotificationModal.value = true;

  // 開啟後標記所有為已讀(依你需求可選)
  notifications.value = notifications.value.map((n) => ({
    ...n,
    read: true,
  }));
};

const closeNotificationModal = () => {
  showNotificationModal.value = false;
};

const handleNotificationClick = () => {
  // 桌面版點擊通知圖標,或行動版點擊側邊欄內的通知區塊,都會開啟 Modal
  openNotificationModal();
};

/* 登出 */

const goProfile = () => {
  closeSidebar();
  console.log("導航到個人資料頁");
  router.push('/profile') // 假設有 profile 頁面
};

const logout = () => {
  showLogoutConfirm.value = true;
};

const confirmLogout = () => {
  isSidebarOpen.value = false;
  showLogoutConfirm.value = false;

  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");

  router.push("/");
};

const cancelLogout = () => {
  showLogoutConfirm.value = false;
};

/* -----------------------------
   自動行為:換頁 → 關閉所有面板
----------------------------- */

watch(
  () => route.path,
  () => {
    // 只需要關閉右側側邊欄
    closeSidebar();
  }
);

/*通知數量控制 */
// 通知列表(未來可從 API / localStorage 取得)
const notifications = ref([
  { id: 1, title: "今日產檢提醒", read: false },
  { id: 2, title: "產後填寫問卷提醒", read: true },
]);
// 計算未讀通知數量
const notificationCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});
</script>

<style scoped>
/* ===========================================================
   App.vue - 統一重構 RWD CSS
   =========================================================== */
.font-inter {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
}

/* ---------------------------
   Base layout
   --------------------------- */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f6f8fb;
  color: #223;
}

.content-wrapper {
  flex: 1;
}

/* ---------------------------
   Navbar (桌機優先樣式)
   --------------------------- */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(135deg, #fff);
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 0;
  z-index: 1200;
}

/* logo */
.logo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #57aee2;
  letter-spacing: 0.3px;
}

/* nav */
.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex: 1;
  justify-content: center; /* 桌面版導覽列置中 */
}

.nav :hover {
  cursor: pointer;
  color: #999;
}

.nav a {
  color: #000;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.25rem 0.2rem;
  position: relative;
  transition: opacity 0.2s;
}
.nav a:hover {
  opacity: 0.9;
}
.nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  background: #888;
  transition: width 0.25s ease;
}
.nav a:hover::after,
.nav a.router-link-exact-active::after {
  width: 100%;
}

/* icons group (桌機時靠右) */
.icons-group {
  display: flex;
  gap: 14px;
  align-items: center;
}

/* notify-icon - 桌面版顯示 */
.notify-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  position: relative;
  color: #57aee2;
  transition: transform 0.2s;
}
.notify-icon:hover {
  transform: scale(1.05);
}
.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 999px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  line-height: 1;
}

/* profile icon */
.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #57aee2;
  border: 2px solid #57aee2;
  transition: background 0.2s;
  overflow: hidden; /* 確保圖片不會超出邊界 */
}
.profile-icon:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 頭像預覽圖片 (導覽列) */
.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* ---------------------------
   Sidebar (右側 Unified Menu)
   --------------------------- */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.36);
  z-index: 1900;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -100%; /* 預設完全隱藏 */
  width: 320px;
  max-width: 85%; /* 確保在小螢幕上不會超過 */
  height: 100vh;
  background: #fff;
  box-shadow: -6px 0 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: right 0.32s ease;
  z-index: 2000;
}

.sidebar.open {
  right: 0;
}

/* 頂部使用者資訊 */
.sidebar-header {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 5px;
}
.sidebar .avatar {
  min-width: 60px; /* 確保頭像不會被擠壓 */
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #57aee2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  overflow: hidden; /* 確保圖片不會超出邊界 */
}

/* 側邊欄頭像圖片 */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.sidebar .user-info h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}
.sidebar .user-info p {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

/* 行動版通知區塊 (取代原 mobile-nav 內通知) */
.mobile-notify {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 6px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f8f9ff, #eef2ff);
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}
.mobile-notify:hover {
  background: #eef2ff;
}
.mobile-notify .dot {
  min-width: 36px;
  min-height: 36px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  position: relative;
}
.mobile-notify .txt {
  font-weight: 600;
  color: #333;
}
.notification-badge-mobile {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4d4f;
  color: #fff;
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: 999px;
  font-weight: 700;
  line-height: 1.1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

/* 導覽列連結 (新增) */
.sidebar-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0; /* 讓 border-bottom 控制間隔 */
  margin-top: 5px;
  margin-bottom: 20px;
  padding: 10px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.sidebar-nav-links a {
  color: #222;
  text-decoration: none;
  font-size: 1.02rem;
  padding: 12px 4px;
  border-bottom: 1px solid #f2f3f5;
  display: flex;
  align-items: center;
  transition: color 0.2s, background 0.2s;
}
.sidebar-nav-links a:hover {
  background: #f8f8f8;
}
.sidebar-nav-links a:last-of-type {
  border-bottom: none;
}
.sidebar-nav-links a.router-link-exact-active {
  color: #006aa8;
  font-weight: 700;
  background: #f4f6ff;
  border-radius: 4px;
}

/* 個人資料按鈕區 */
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 登出按鈕所在區域固定在底部 */
.sidebar-footer {
  margin-top: auto;
  padding-bottom: 50px;
}

/* sidebar buttons */
.menu-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: #57aee2;
  color: white;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-bottom: 15px;
  transition: background 0.3s ease;
}
.menu-btn:hover {
  background: #764ba2;
}

/* 登出按鈕 */
.logout-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: #e63946;
  color: white;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  transition: background 0.3s ease;
}
.logout-btn:hover {
  background: #d62f3a;
}

/* ---------------------------
   Footer
   --------------------------- */
.footer {
  margin-top: auto;
  background: linear-gradient(135deg, #57aee2 );
  color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}
.footer-bottom {
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.footer p {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.85;
}

/* ---------------------------
   Modals (Logout Confirmation & Notification)
   --------------------------- */
.logout-modal-overlay,
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.logout-modal-overlay {
  z-index: 5000;
}
.modal-overlay {
  z-index: 4000; /* 通知 Modal 優先級略低於登出確認 */
}

.logout-modal,
.modal-window {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 380px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 0;
  overflow: hidden;
}

.modal-window {
  max-width: 520px; /* 通知 Modal 稍寬 */
  padding: 30px;
  position: relative;
}

.logout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #eee;
}
.logout-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}
.close,
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.close {
  position: absolute;
  right: 15px;
  top: 15px;
}

.logout-actions {
  padding: 1.2rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}
.cancel-btn {
  background: #f1f1f1;
  color: #333;
}
.cancel-btn:hover {
  background: #e0e0e0;
}
.confirm-btn {
  background: #758ecd; /* 確認按鈕顏色改為藍色系 */
  color: #fff;
}
.confirm-btn:hover {
  background: #627cb2;
}
.logout-actions .confirm-btn {
  background: #e63946; /* 登出確認按鈕維持紅色 */
}
.logout-actions .confirm-btn:hover {
  background: #d62f3a;
}

/* 通知 Modal 內容樣式 */
.modal-window h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-top: 15px;
  margin-bottom: 5px;
}

.modal-window p {
  color: #555;
  margin-bottom: 10px;
}

.modal-window .confirm-btn {
  margin-top: 20px;
  float: right;
}
.modal-window::after {
  content: "";
  display: table;
  clear: both;
}

/* Dropdown 整體 */
.dropdown {
  position: relative;
  display: inline-block;
}
/* 下拉選單內容 */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border-radius: 6px;
  z-index: 10;
  padding: 10px 0;
}
/* 下拉選項 */
.dropdown-content a {
  display: block;
  padding: 10px 16px;
  color: #555;
  text-decoration: none;
  font-size: 16px;
}
.dropdown-content a:hover {
  background: #f0f0f0;
}
/* 滑鼠 hover 顯示下拉 */
.dropdown:hover .dropdown-content {
  display: block;
}

/* =========================================================
   Responsive rules (RWD 斷點)
   ========================================================= */

/* ---------------------------
   Tablet Landscape (max-width: 1024px)
   --------------------------- */
@media (max-width: 1024px) {
  .nav {
    gap: 1rem;
  }
  .nav a {
    font-size: 0.9rem;
  }
  .logo {
    font-size: 1.25rem;
  }
  .top-bar {
    padding: 0.85rem 1.5rem;
  }
  .notify-icon {
    width: 40px;
    height: 40px;
  }
  .profile-icon {
    width: 36px;
    height: 36px;
  }
}

/* ---------------------------
   Mobile Landscape & Tablet Portrait (max-width: 768px)
   - 主要行動裝置 UI 模式
   --------------------------- */
@media (max-width: 768px) {
  /* Header 佈局變更 */
  .nav {
    display: none;
  } /* 隱藏桌面導覽列 */
  .notify-icon {
    display: none;
  } /* 隱藏頂部通知圖標 (移入 Sidebar) */

  /* Logo 置中,icons 靠右 */
  .top-bar {
    padding: 0.8rem 1rem;
  }
  .logo {
    flex: 1;
    text-align: center;
    font-size: 1.15rem;
  }
  .icons-group {
    margin-left: auto;
    gap: 10px;
  }

  /* profile icon 縮小 */
  .profile-icon {
    width: 34px;
    height: 34px;
  }

  /* Sidebar 限制最大寬度並確保完全隱藏 */
  .sidebar {
    max-width: 85%;
    width: 280px;
  }

  /* Footer 調整 */
  .footer-bottom {
    padding: 0.8rem 1rem;
  }
}

/* ---------------------------
   Extra Small Mobile (max-width: 420px)
   --------------------------- */
@media (max-width: 420px) {
  .logo {
    font-size: 1rem;
  }
  .top-bar {
    padding: 0.6rem 0.8rem;
  }
  .profile-icon {
    width: 30px;
    height: 30px;
  }
  .footer-bottom {
    padding: 0.6rem 0.8rem;
  }
  .modal-window {
    padding: 20px;
  }
}
</style>
