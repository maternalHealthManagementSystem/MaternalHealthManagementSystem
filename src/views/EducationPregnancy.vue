<template>
  <div class="education-page">
    <div class="page-header">
      <h2>孕期衛教資訊</h2>
      <SearchBar @search="handleSearch" />
      <div class="search-placeholder"></div>
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
                    class="custom-checkbox"
                  />
                  <span class="status-text">{{
                    item.checked ? "已讀" : "未讀"
                  }}</span>
                </label>

                <a :href="item.link" target="_blank" class="item-link">
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
  /* max-width: 1100px; */
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

.page-header {
  margin-bottom: 40px;
}
.page-header h2 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

/* 主版面佈局：左內容 + 右目錄 */
.main-layout {
  display: flex;
  gap: 50px;
  position: relative;
}

.content-area {
  flex: 1; /* 左側佔滿剩餘空間 */
}

/* 每一大區塊 (Row) */
.section-row {
  display: flex;
  margin-bottom: 50px; /* 區塊間距 */
  align-items: flex-start;
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
  align-items: center;
  padding: 15px 0;
  border-bottom: 2px solid #e0e0e0; /* 底部粗灰線，仿照截圖 */
}

/* 核取方塊樣式 */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 20px;
  color: #999;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #5a6b7c; /* 勾選後的顏色 */
}

.status-text {
  font-size: 16px;
  user-select: none;
}

/* 連結文字樣式 */
.item-link {
  font-size: 18px;
  /* 標題加粗 */
  /* font-weight: bold;  */
  color: #333; /* 預設深色 */
  text-decoration: none;
  transition: color 0.2s;
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
}

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

/* RWD */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column-reverse;
  }
  .section-row {
    flex-direction: column;
  }
  .week-label {
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    width: 100%;
  }
  .checklist-container {
    padding-left: 0;
    border-left: none;
  }
  .sidebar {
    width: 100%;
    margin-bottom: 30px;
  }
}
</style>
