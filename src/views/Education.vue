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
import EducationCard from '../components/EducationCard.vue';
import ScrollTop from '../components/ScrollTop.vue';

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
      { text: `目前懷孕第18週，以下為推薦內容：` },
      { text: '早產防治、須立即就醫之危險徵兆', link: 'https://ihealth.vghtc.gov.tw/media/605' },
      { text: '哺餵母乳衛教', link: 'https://ihealth.vghtc.gov.tw/media/648' },
      { text: '認識妊娠高血壓', link: 'https://ihealth.vghtc.gov.tw/media/449' }
    ]
  },
  {
    id: 'prenatal-checkup',
    title: '產檢衛教資訊',
    path: '/education/prenatal-checkup',
    desc: [
      // { text: `目前懷孕第 ${currentWeek.value} 週，推薦內容：` },
      { text: `目前懷孕第18週，以下為推薦內容：` },
      { text: '早期子癇前症篩檢 + 子宮動脈血流量測', 
        link: 'https://www.vghtc.gov.tw/UnitPage/RowViewDetail?WebRowsID=6136e0c5-61e2-4e29-9254-65c942d2ca82&UnitID=349b6142-4637-4356-8a17-a553d01d0b52&CompanyID=e8e0488e-54a0-44bf-b10c-d029c423f6e7&UnitDefaultTemplate=1' 
      },
      { text: '第一孕期母血唐氏症篩檢', 
        link: 'https://www.vghtc.gov.tw/UnitPage/RowViewDetail?WebRowsID=610672ce-8b46-472e-87fd-a2d5b670a5b0&UnitID=349b6142-4637-4356-8a17-a553d01d0b52&CompanyID=e8e0488e-54a0-44bf-b10c-d029c423f6e7&UnitDefaultTemplate=1' 
      },
      { text: '非侵入性染色體篩檢NIPS', 
        link: 'https://www.vghtc.gov.tw/UnitPage/RowViewDetail?WebRowsID=03d10c24-5549-42b9-81ec-11116af79a42&UnitID=349b6142-4637-4356-8a17-a553d01d0b52&CompanyID=e8e0488e-54a0-44bf-b10c-d029c423f6e7&UnitDefaultTemplate=1' 
      },
      { text: '第二孕期母血唐氏症篩檢', 
        link: 'https://www.vghtc.gov.tw/UnitPage/RowViewDetail?WebRowsID=617d2450-e735-4925-a510-329d2967eccc&UnitID=349b6142-4637-4356-8a17-a553d01d0b52&CompanyID=e8e0488e-54a0-44bf-b10c-d029c423f6e7&UnitDefaultTemplate=1' 
      },
      { text: '羊膜穿刺(需預約)、羊水晶片檢測(Array CGH)', 
        link: 'https://www.vghtc.gov.tw/UnitPage/UnitContentView?WebMenuID=4fb5d8c2-3896-4353-8507-836bb762f0f9&UnitID=adaf167e-fe3e-4956-8ba5-6571087eed85&UnitDefaultTemplate=1' 
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
  padding-bottom: 40px;
}

/* 手機版調整 */
@media (max-width: 768px) {
  .page-container {
    padding-top: 20px; /* 手機版頂部留白減少 */
  }
}
</style>