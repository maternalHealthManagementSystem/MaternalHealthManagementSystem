<template>
  <div class="page-container">
    
    <EducationCard 
      v-for="item in infoList" 
      :key="item.id"
      :title="item.title"
      :desc="item.desc"
      @click-more="goMore(item.path)"
    />

  </div>
  <ScrollTop />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EducationCard from '@/components/EducationCard.vue';
import ScrollTop from '@/components/ScrollTop.vue';

const router = useRouter();

// 模擬目前的懷孕週數 (之後資料會從 Pinia 或 API 取得)
const currentWeek = ref(12); 

// 資料列表 (模擬依照週數產生不同的推薦文字)
const infoList = ref([
  {
    id: 'pregnancy',
    title: '孕期衛教資訊',
    path: '/education/pregnancy',
    desc: [
      // { text: `目前懷孕第 ${currentWeek.value} 週，推薦內容：` },
      { text: '各孕期不適症狀處理', link: 'https://ihealth.vghtc.gov.tw/media/443' },
      { text: '孕期中出血的介紹', link: 'https://ihealth.vghtc.gov.tw/media/451' },
      { text: '心臟病孕婦自我照顧', link: 'https://ihealth.vghtc.gov.tw/media/502' },
      { text: '認識早期破水', link: 'https://ihealth.vghtc.gov.tw/media/504' }
    ]
  },
  {
    id: 'prenatal-checkup',
    title: '產檢衛教資訊',
    path: '/education/prenatal-checkup',
    desc: [
      // { text: `目前懷孕第 ${currentWeek.value} 週，推薦內容：` },
      { 
        text: '超音波檢查、血液常規、尿液常規、愛滋病篩檢、B型肝炎檢查...', 
        link: 'https://www.vghtc.gov.tw/UnitPage/RowViewDetail?WebRowsID=4a463034-b9a0-4709-a5d5-01b9c76c8871&UnitID=349b6142-4637-4356-8a17-a553d01d0b52&CompanyID=e8e0488e-54a0-44bf-b10c-d029c423f6e7&UnitDefaultTemplate=1' 
      }
    ]
  }
]);

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
  padding-top: 40px; /* 頂部留白 */
}
</style>