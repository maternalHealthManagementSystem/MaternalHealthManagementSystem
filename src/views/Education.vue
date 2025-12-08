<template>
  <div class="page-container">
    
    <EducationCard 
      v-for="item in formattedInfoList" 
      :key="item.id"
      :title="item.title"
      :desc="item.desc"
      @click-more="goMore(item.path)"
    />

  </div>
  <ScrollTop />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import EducationCard from '../components/EducationCard.vue';
import ScrollTop from '../components/ScrollTop.vue';
// 引入JSON 資料
import pregnancyData from '../assets/data/pregnancyData.json';
import prenatalData from '../assets/data/prenatalData.json';
import vaccineData from '../assets/data/vaccineData.json';
const router = useRouter();

// 模擬目前的懷孕週數為18週 (之後資料會從 Pinia 或 API 取得)
const currentWeek = ref(18); 

// --- 核心邏輯 1: 純數字比對 ---
// 只要項目沒有 minWeek，或是週數不符，就回傳 false
const isWeekMatch = (item, current) => {
  // 1. 過濾掉沒有設定 minWeek 的資料
  // 這會自動排除 "所有週數" (id:12) 和 "依臨床需求" (id:13)，因為它們沒有 minWeek 欄位
  if (item.minWeek === undefined || item.minWeek === null) {
    return false;
  }

  // 2. 取得範圍數字
  const min = item.minWeek;
  // 如果沒有 maxWeek，預設為 999 (代表一直顯示到最後)
  const max = (item.maxWeek !== undefined && item.maxWeek !== null) ? item.maxWeek : 999;

  // 3. 比對是否在範圍內
  return current >= min && current <= max;
};

// --- 核心邏輯 2: 將複雜的產檢資料轉平 (處理 subItems) ---
const flattenPrenatalItem = (item) => {
  if (item.subItems && item.subItems.length > 0) {
    return item.subItems.map(sub => ({
      text: sub.title,
      link: sub.url
    }));
  }
  return [{
    text: item.content,
    link: item.link
  }];
};

// --- 核心邏輯 3: Computed 自動計算顯示內容 ---
const formattedInfoList = computed(() => {
  // 1. 處理【孕期衛教資訊】
  const pregnancyRecommendations = pregnancyData
    .filter(item => isWeekMatch(item, currentWeek.value)) 
    .flatMap(item => item.items)
    .map(item => ({
      text: item.title,
      link: item.link
    }));

  // 2. 處理【產檢衛教資訊】
  const prenatalRecommendations = prenatalData
    .filter(item => isWeekMatch(item, currentWeek.value)) 
    .flatMap(item => flattenPrenatalItem(item));
  
  // 3. 處理【疫苗接種】
  const vaccineRecommendations = vaccineData
    .filter(item => isWeekMatch(item, currentWeek.value))
    .map(item => ({
      // 因為疫苗沒有連結，只顯示文字
      // 這裡將「疫苗名稱」和「描述」組合成一段文字顯示
      text: `${item.name}：${item.desc}`, 
      link: '', // 沒有連結傳空字串，EducationCard 會自動處理成純文字
      isVaccine: true  // 標記它是疫苗，需要變色
    }));

  // 3. 組裝回 EducationCard 需要的格式
  return [
    {
      id: 'pregnancy',
      title: '孕期衛教資訊',
      path: '/education/pregnancy',
      desc: [
        { text: `目前懷孕第 ${currentWeek.value} 週，推薦內容：`, link: '' },
        ...pregnancyRecommendations
      ]
    },
    {
      id: 'prenatal-checkup',
      title: '產檢衛教資訊',
      path: '/education/prenatal-checkup',
      desc: [
        { text: `目前懷孕第 ${currentWeek.value} 週，推薦內容：`, link: '' },
        ...prenatalRecommendations,
        ...vaccineRecommendations
      ]
    }
  ];
});

// 跳轉功能
const goMore = (path) => {
  router.push(path);
};

// --- 未來接後端時的擴充空間 ---
// onMounted(async () => {
//   // 1. 呼叫 API 取得使用者週數與推薦內容
//   // 2. 更新 infoList.value
// })
</script>

<style scoped>
.page-container {
  /* 頂部留白 */
  /* padding-top: 5px;  */
  padding-bottom: 40px;
}

/* 手機版調整 */
@media (max-width: 768px) {
  .page-container {
    padding-top: 20px; /* 手機版頂部留白減少 */
  }
}
</style>