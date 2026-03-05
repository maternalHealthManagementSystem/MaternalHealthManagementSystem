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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import EducationCard from '../components/EducationCard.vue';
import ScrollTop from '../components/ScrollTop.vue';
// 引入JSON 資料
import pregnancyData from '../assets/data/pregnancyData.json';
import prenatalData from '../assets/data/prenatalData.json';
import vaccineData from '../assets/data/vaccineData.json';
const router = useRouter();

// 將初始值設為 0 (代表資料還沒載入)
const currentWeek = ref(0); 
const isLoading = ref(true); // 用來控制畫面載入狀態

// --- 利用lmp計算懷孕週數 ---
const calculatePregnancyByLMP = (lmpDate) => {
  if (!lmpDate) return;

  const today = dayjs().startOf("day");   
  const lmp = dayjs(lmpDate).startOf("day");
  const diffDays = today.diff(lmp, "day"); // 計算總天數

  if (diffDays < 0) { 
    currentWeek.value = 0;
    return;
  }
  
  // 醫療邏輯：通常以 280 天為限
  const currentTotalDays = Math.min(diffDays, 280);
  currentWeek.value = Math.floor(currentTotalDays / 7);

  console.log(`LMP: ${lmpDate}, 計算結果為第 ${currentWeek.value} 週`);
};

// --- 頁面載入時從後端獲取 LMP ---
onMounted(async () => {
  try {
    isLoading.value = true;
    
    // 從 sessionStorage 取出使用者資料
    const userDataStr = sessionStorage.getItem("user");

    // 解析 JSON 並取得 user_id
    const user = JSON.parse(userDataStr);
    const userId = user.user_id; // 這就是動態的 'U001', 'U002', 或 'U003'

    // 發送請求
    const response = await fetch(`http://localhost:3000/api/personal_information/${userId}`);
    const result = await response.json();

    if (result.success && result.data) {
      // 判斷後端是否有傳回 lmpDate (來自你之前修改的 API)
      if (result.data.lmpDate) {
        calculatePregnancyByLMP(result.data.lmpDate);
      } else if (result.data.dueDate) {
        // 備案：如果沒有 LMP，用預產期往前推 280 天反推
        const manualLmp = dayjs(result.data.dueDate).subtract(280, 'day').format('YYYY-MM-DD');
        calculatePregnancyByLMP(manualLmp);
      }
    }
  } catch (error) {
    console.error("無法獲取週數資料，將使用預設值 0:", error);
  } finally {
    isLoading.value = false;
  }
});



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
        { text: `目前懷孕第 ${currentWeek.value} 週，以下為推薦內容：`, link: '' },
        ...pregnancyRecommendations
      ]
    },
    {
      id: 'prenatal-checkup',
      title: '產檢衛教資訊',
      path: '/education/prenatal-checkup',
      desc: [
        { text: `目前懷孕第 ${currentWeek.value} 週，以下為推薦內容：`, link: '' },
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