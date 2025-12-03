<template>
  <div class="page-container">
      <h2 class="title">產檢衛教資訊</h2> 
      <SearchBar @search="handleSearch" />
      <!-- 查有搜尋結果 -->
      <div v-if="hasResult" class="content-container">
        <!-- 產檢衛教區塊 -->
        <section v-if="filteredPrenatalData.length > 0" class="info-section">
          <div class="section-label">產檢衛教</div>
          <div class="section-body">
          
            <div 
              v-for="(item, index) in filteredPrenatalData" 
              :key="item.id" 
              class="accordion-item"
            >
              <!-- 手風琴內容 -->
              <div class="accordion-header" @click="toggleAccordion(index)">
                  <span class="arrow" :class="{ 'rotated': item.isOpen }">▶</span>
                  <span class="week-title">{{ item.week }}</span>
              </div>

              <transition name="slide-fade">
                <div v-show="item.isOpen" class="accordion-content">
                  <div v-if="item.subItems" class="sub-items-container">
                    <div v-for="(sub, idx) in item.subItems" :key="idx" class="sub-item-row">
                      <div class="sub-item-text">
                        {{ sub.title }}
                      </div>
                      <a :href="sub.url" target="_blank" class="info-link-mini">
                        相關詳細資訊 ➜
                      </a>
                    </div>
                  </div>
                  <div v-else>
                    <p class="content-text">{{ item.content }}</p>
                    <p v-if="item.note" class="content-note">{{ item.note }}</p>
                    
                    <div v-if="item.link" class="link-container">
                      <a :href="item.link" target="_blank" class="info-link">
                        相關詳細資訊 ➜
                      </a>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </section>


        <hr v-if="filteredPrenatalData.length > 0 && filteredVaccineData.length > 0"  class="divider" />
        <!-- 疫苗區塊 -->
        <section v-if="filteredVaccineData.length > 0" class="info-section">
          <div class="section-label">孕期疫苗</div>
          <div class="section-body">
            <div v-for="vaccine in filteredVaccineData" :key="vaccine.id" class="vaccine-item">
              <span class="vaccine-name">{{ vaccine.name }}</span>
              <span class="vaccine-time">{{ vaccine.time }}</span>
              <p class="vaccine-desc" v-if="vaccine.desc">{{ vaccine.desc }}</p>
            </div>
          </div>
        </section>
      </div>
      <!-- 查無搜尋結果 -->
      <div v-else class="no-result">
        <img src="../assets/no-result.png" alt="" />
        <p>查無搜尋結果</p>
      </div>
  </div>
  <ScrollTop />
</template>

<script setup>
import { ref } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import ScrollTop from '../components/ScrollTop.vue';
// 引入 JSON 檔案
import prenatalJson from '../assets/data/prenatalData.json';
import vaccineJson from '../assets/data/vaccineData.json';
const prenatalData = ref(prenatalJson);
const vaccineData = ref(vaccineJson);


// 切換手風琴開關
const toggleAccordion = (index) => {
  // 直接操作 filteredPrenatalData
  filteredPrenatalData.value[index].isOpen = !filteredPrenatalData.value[index].isOpen;
};

//新增變數
const filteredPrenatalData = ref([...prenatalData.value]);
const filteredVaccineData = ref([...vaccineData.value]);
const hasResult = ref(true);
const keyword = ref('');

// 搜尋功能 
const handleSearch = (key) => {
  keyword.value = key;
  const kw = key.trim().toLowerCase();

  if (!kw) {
    // 清空搜尋 → 恢復原始資料
    filteredPrenatalData.value = [...prenatalData.value];
    filteredVaccineData.value = [...vaccineData.value];
    hasResult.value = true;
    return;
  }

  // 搜尋產檢資料
  const prenatalResult = prenatalData.value.filter(item => {
    // 搜尋週數
    if (item.week.toLowerCase().includes(kw)) return true;
    
    // 搜尋 content
    if (item.content && item.content.toLowerCase().includes(kw)) return true;
    
    // 搜尋 subItems
    if (item.subItems) {
      return item.subItems.some(sub => 
        sub.title.toLowerCase().includes(kw)
      );
    }
    
    return false;
  });

  // 搜尋疫苗資料
  const vaccineResult = vaccineData.value.filter(vaccine => 
    vaccine.name.toLowerCase().includes(kw) ||
    vaccine.time.toLowerCase().includes(kw) ||
    (vaccine.desc && vaccine.desc.toLowerCase().includes(kw))
  );

  filteredPrenatalData.value = prenatalResult;
  filteredVaccineData.value = vaccineResult;
  
  // 判斷是否有結果
  hasResult.value = prenatalResult.length > 0 || vaccineResult.length > 0;
};
</script>

<style scoped>
/* 容器設定 */
.page-container {
  width: 65%;
  margin: 40px auto;
}

.title {
  color: #3b4a5a;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 700;
}

h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

/* 區塊佈局：左標題 + 右內容 */
.info-section {
  display: flex;
  margin-bottom: 30px;
  align-items: flex-start;
}

/* 左側標籤 */
.section-label {
  width: 150px;
  font-size: 23px;
  color: #3b4a5a;
  flex-shrink: 0; /* 防止被壓縮 */
}

/* 右側內容區 */
.section-body {
  flex-grow: 1;
}

/* 手風琴樣式 */
.accordion-item {
  margin-bottom: 15px;
}

.accordion-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  transition: color 0.3s;
}

.accordion-header:hover {
  color: #3498db; /* Hover 顏色 */
}

/* 三角形圖示與動畫 */
.arrow {
  display: inline-block;
  margin-right: 10px;
  font-size: 12px;
  color: #99a;
  transition: transform 0.3s ease;
}

.arrow.rotated {
  transform: rotate(90deg);
}

.week-title {
  font-weight: 500;
}

/* 展開內容樣式 */
.accordion-content {
  padding: 15px 0 15px 25px;
  background-color: #f9f9f9; /* 淡淡的背景色區分 */
  color: #666;
  line-height: 1.6;
  border-radius: 0 0 4px 4px;
}

/* 分隔線 */
.divider {
  border: 0;
  border-top: 2px solid #e0e0e0;
  margin: 30px 0;
}

/* 疫苗文字區塊樣式 */
.vaccine-item {
  background-color: #8faec6; /* 圖片中的灰藍色塊背景 */
  color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  line-height: 1.6;
}

.vaccine-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.vaccine-time {
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.2);
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  align-self: flex-start; /* 靠左對齊 */
  margin-bottom: 8px;
}

.vaccine-desc {
  font-size: 15px;
  line-height: 1.4;
  margin: 0;
}

/* Vue Transition 動畫效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
  max-height: 200px; /* 設定高度以產生滑動效果 */
  opacity: 1;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* 連結容器樣式 */
.link-container {
  margin-top: 15px;
  text-align: right; /* 按鈕靠右 */
  padding-right: 20px;
}

.info-link {
  display: inline-block;
  color: #3498db;
  text-decoration: none;
  font-size: 15px;
  border: 1px solid #3498db;
  padding: 3px 10px;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.info-link:hover {
  background-color: #3498db;
  color: white;
}

/* 多項目容器 */
.sub-items-container {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 項目之間的間距 */
}

/* 每一行的樣式 */
.sub-item-row {
  display: flex;
  justify-content: space-between; /* 文字靠左，按鈕靠右 */
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee; /* 虛線分隔 */
  padding-right: 20px;
}

.sub-item-row:last-child {
  border-bottom: none;
}

.sub-item-text {
  font-size: 16px;
  color: #555;
  padding-right: 10px;
}

/* 較小的連結按鈕樣式 */
.info-link-mini {
  display: inline-block;
  color: #3498db;
  text-decoration: none;
  font-size: 15px;
  border: 1px solid #3498db;
  padding: 3px 10px;
  border-radius: 15px;
  white-space: nowrap; /* 防止按鈕文字換行 */
  transition: all 0.3s ease;
}

.info-link-mini:hover {
  background-color: #3498db;
  color: white;
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
</style>
