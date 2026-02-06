<template>
  <div class="education-page">
    <div class="page-header">
      <h2>孕期衛教資訊</h2>
      <SearchBar @search="handleSearch" />
    </div>

    <div class="main-layout">
      <div class="content-area">
        <!-- 查有搜尋結果 -->
        <template v-if="hasResult">
          <div
            v-for="section in filteredSections"
            :key="section.id"
            :id="section.id"
            class="section-row"
          >
            <div class="week-label">
              <h3>{{ section.range }}</h3>
            </div>

            <div class="checklist-container">
              <div
                v-for="(item, idx) in section.items"
                :key="idx"
                class="checklist-item"
              >
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="item.checked"
                    disabled
                    class="custom-checkbox"
                  />
                  <span class="status-text">{{
                    item.checked ? "已讀" : "未讀"
                  }}</span>
                </label>

                <a 
                  :href="item.link" 
                  target="_blank" 
                  class="item-link"
                  @click="handleLinkClick(item)"
                >
                  {{ item.title }}
                </a>
              </div>
            </div>
          </div>
        </template>

        <!-- 查無搜尋結果 -->
        <div v-else class="no-result">
          <img src="../assets/no-result.png" alt="" />
          <p>查無搜尋結果</p>
        </div>
      </div>

      <aside v-if="!keyword" class="sidebar">
        <div class="toc-box">
          <h4 class="toc-title">目錄</h4>
          <nav>
            <ul>
              <li v-for="section in sections" :key="section.id">
                <a
                  href="#"
                  @click.prevent="scrollToSection(section.id)"
                  class="toc-link"
                >
                  {{ section.range }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  </div>
  <ScrollTop />
</template>

<script setup>
import { ref } from "vue";
import SearchBar from "../components/SearchBar.vue";
import ScrollTop from "../components/ScrollTop.vue";
// 引入 JSON 檔案
import pregnancyData from "../assets/data/pregnancyData.json";
// checkbox 可以被修改 (checked 狀態)，使用 ref 包起來
// 使用 JSON.parse/stringify 深拷貝，避免汙染原始 JSON
const sections = ref(JSON.parse(JSON.stringify(pregnancyData)));

// 平滑捲動功能
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80; // 扣除上方導覽列高度
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

/* --- 文章點擊處理 --- */
const handleLinkClick = async (item) => {
  // 如果已經是已讀狀態，就不用再做動作 (避免重複發送 API)
  if (item.checked) return;

  // 1. 前端 UI 即時更新：直接將該物件的 checked 設為 true
  item.checked = true;

  // 2. (重要) 呼叫後端 API 儲存狀態
  // 這裡需要搭配你前面設計的 API，確保重新整理頁面後狀態還在
  try {
    // 假設你的 API路徑是 /api/read-status
    // 這裡的 item.id 對應你 JSON 裡的 he_pregnancy_id (請依實際欄位名稱調整)
    
    /* 範例程式碼：
    await fetch('http://你的後端網址/api/read-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article_id: item.id, // 或 item.he_pregnancy_id
        user_id: '目前登入的使用者ID' 
      })
    });
    */
    console.log(`文章 "${item.title}" 已標記為已讀`);
    
  } catch (error) {
    console.error("更新閱讀狀態失敗", error);
    // 如果 API 失敗，視情況決定是否要將 checked 改回 false
    // item.checked = false; 
  }
};

/* --- 搜尋結果用資料 --- */
const filteredSections = ref([...sections.value]); // 初始化顯示原始內容
const hasResult = ref(true);
const keyword = ref("");
/* --- 搜尋功能 --- */
const handleSearch = (key) => {
  keyword.value = key; // 記錄目前搜尋文字
  const kw = key.trim().toLowerCase();

  if (!kw) {
    // 清空搜尋 → 回原始資料
    filteredSections.value = [...sections.value];
    hasResult.value = true;
    return;
  }

  // 每週中是否任何 item title 包含關鍵字
  const result = sections.value
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => item.title.toLowerCase().includes(kw)),
    }))
    .filter((sec) => sec.items.length > 0);

  filteredSections.value = result;
  hasResult.value = result.length > 0;
};
</script>

<style scoped>
/* 整體容器 */
.education-page {
  width: 65%;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  background-color: #f9fbfd; /* 整個頁面給一個底色 */
  min-height: 100vh; /* 確保背景色填滿 */
}

.page-header {
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #ffffff, #f0f4f8); /* 標題區塊微漸層 */
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);;
}

.page-header h2 {
  font-size: 28px;
  color: #2c3e50;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
}

/* 主版面佈局：左內容 + 右目錄 */
.main-layout {
  display: flex;
  gap: 50px;
  position: relative;
}

.content-area {
  flex: 1; /* 左側佔滿剩餘空間 */
  min-width: 0; /* 防止 flex item 內容撐開導致破版 */
}

/* 每一大區塊 (Row) */
.section-row {
  display: flex;
  margin-bottom: 50px; /* 區塊間距 */
  align-items: flex-start;
  scroll-margin-top: 100px; /* 配合 scrollToSection，讓錨點定位準確 */
}

/* 左側：週數標題 */
.week-label {
  width: 120px;
  flex-shrink: 0;
  padding-top: 15px; /* 對齊第一行文字 */
}

.week-label h3 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* 右側：清單容器 */
.checklist-container {
  flex-grow: 1;
  border-left: 2px solid #eee; /* 中間的分隔線 */
  padding-left: 30px;
}

/* 單一清單項目 */
.checklist-item {
  display: flex;
  align-items: flex-start; /* 靠上對齊，避免文字換行時 checkbox 跑版 */
  padding: 15px 0;
  border-bottom: 2px solid #e0e0e0; /* 底部粗灰線，仿照截圖 */
}

/* 核取方塊樣式 */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: default;
  margin-right: 20px;
  color: #999;
  flex-shrink: 0; /* 防止 checkbox 被壓縮 */
  padding-top: 2px; /* 微調對齊 */
}

.custom-checkbox {
  width: 20px;
  height: 18px;
  margin-right: 8px;
  accent-color: #5a6b7c;  /* 勾選後的顏色 */
}

.custom-checkbox:disabled {
  opacity: 1; 
}

.status-text {
  font-size: 16px;
  user-select: none;
  white-space: nowrap; /* 防止「已讀」換行 */
}

/* 連結文字樣式 */
.item-link {
  font-size: 18px;
  /* 標題加粗 */
  /* font-weight: bold;  */
  color: #333; /* 預設深色 */
  text-decoration: none;
  transition: color 0.2s;
  display: block;
}

.item-link:hover {
  color: #3498db;
}

/* --- 右側目錄區 (Sticky) --- */
.sidebar {
  width: 220px;
  flex-shrink: 0;
}

.toc-box {
  position: sticky;
  top: 100px;
  background-color: #e3e9ef; /* 淡藍灰背景 */
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #d0d7de;
  /* 陰影效果 */
  /* box-shadow: 0 2px 8px rgba(0,0,0,0.05); */
}

.toc-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  color: #555;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.toc-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-box li {
  margin-bottom: 12px;
}

.toc-link {
  text-decoration: none;
  font-weight: bold;
  color: #3498db; /* 藍色連結 */
  font-size: 16px;
  transition: opacity 0.2s;
  border-bottom: 1px solid transparent;
}

.toc-link:hover {
  color: #1e6091;
  border-bottom-color: #1e6091;
  transform: translateX(5px); /* hover 時微微右移 */
}

/* No Result */
.no-result {
  width: 100%;
  text-align: center;
  margin-top: 100px;
  color: #b56b6b;
  font-size: 22px;
  font-weight: bold;
}

.no-result img {
  width: 120px;
  opacity: 0.8;
  margin-bottom: 20px;
}

/* iPad Air & Tablet (範圍: 768px ~ 1180px) --- */
@media (max-width: 1180px) {
  .education-page {
    width: 90%; /* 寬度拉大，善用平板空間 */
    padding: 30px 20px;
  }
  
  .main-layout {
    gap: 30px; /* 縮小左右間距 */
  }

  .page-header h2 {
    white-space: nowrap; /* 強制文字不換行 */
    flex-shrink: 0;      /* 防止標題被右邊的搜尋框擠壓收縮 */
    font-size: 24px;     /* 稍微縮小字體，讓空間更餘裕 */
    margin-right: 20px;  /* 確保跟搜尋框保持距離 */
  }

  .sidebar {
    width: 180px; /* 縮小側邊欄 */
  }

  .toc-box {
    padding: 15px; /* 縮小內距 */
  }
}

/* --- 手機尺寸 (Mobile: < 768px) --- */
@media (max-width: 768px) {
  /* 1. 調整最外層容器：縮小左右留白，讓整體往左靠並變寬 */
  .education-page {
    width: 100%;
    padding: 10px 15px;
    box-sizing: border-box;
  }
  
  /* Header 區塊 */
  .page-header {
    flex-direction: column;
    align-items: stretch; 
    gap: 15px;
    /* 2. 調整內部留白：縮小一點，讓內容更滿 */
    padding: 15px; 
    margin-bottom: 15px; /* 區塊間距也稍微縮小 */
  }
  
  .page-header h2 {
    text-align: center;
    font-size: 22px; /* 字體稍微縮小一點點，避免換行 */
  }

  /* 佈局反轉：目錄在內容之上 */
  .main-layout {
    flex-direction: column-reverse; 
    gap: 15px;
  }

  /* 目錄區 */
  .sidebar {
    width: 100%;
  }

  .toc-box {
    position: static;
    padding: 15px; /* 縮小內距 */
    background-color: #f0f4f8;
    border: none;
  }

  /* 目錄按鈕 grid */
  .toc-box ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); /* 讓按鈕可以排更緊密 */
    gap: 8px;
  }

  /* 內容區塊 (白色卡片) */
  .section-row {
    flex-direction: column; 
    margin-bottom: 20px;
    gap: 10px;
    background: #fff;
    /* 3. 這裡是關鍵：卡片內距縮小，文字就會視覺上往左移 */
    padding: 15px; 
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  }

  .week-label {
    width: 100%;
    padding: 0 0 10px 0;
    border-bottom: 2px solid #ebf0f5;
  }
  
  .week-label h3 {
    font-size: 19px;
    color: #2c3e50;
    display: flex;
    align-items: center;
    /* 修正標題文字的左側間距 */
    margin-left: 0; 
  }
  
  /* 藍色小豎條 */
  .week-label h3::before {
    content: '';
    display: inline-block;
    width: 5px; /* 稍微細一點 */
    height: 18px;
    background-color: #8faec6;
    margin-right: 8px; /* 文字離藍色豎條的距離 */
    border-radius: 3px;
  }

  .checklist-container {
    width: 100%;
    padding-left: 0;
    border-left: none;
  }

  .checklist-item {
    padding: 10px 0; /* 項目上下間距微調 */
  }
  
  .item-link {
    font-size: 16px;
    line-height: 1.5;
  }
  
  .checkbox-label {
    margin-right: 10px; /* Checkbox 離文字近一點 */
  }
}
</style>
