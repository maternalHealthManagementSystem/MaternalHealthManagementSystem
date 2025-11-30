import { createRouter, createWebHistory } from 'vue-router';

// 引入頁面元件
import HomePage from '@/views/HomePage.vue';
import PrenatalData from '@/views/PrenatalData.vue';
import Education from '@/views/Education.vue';
import EducationPregnancy from '@/views/EducationPregnancy.vue'
import EducationPrenatalCheckup from '@/views/EducationPrenatalCheckup.vue'
import Postpartum from '@/views/Postpartum.vue';
import SelfAssessment from '@/views/SelfAssessment.vue';
import AssessmentInstructions from '@/views/AssessmentInstructions.vue';
import AssessmentPrenatal from '@/views/AssessmentPrenatal.vue';
import AssessmentDepression from '@/views/AssessmentDepression.vue';
import AssessmentHistory from '@/views/AssessmentHistory.vue';
import AssessmentHistoryDetail from '@/views/AssessmentHistoryDetail.vue';
import Timeline from '@/views/Timeline.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/prenatal-data', name: 'PrenatalData', component: PrenatalData },
  { path: '/education', name: 'Education', component: Education },
  { path: '/education/pregnancy', name: 'EducationPregnancy', component: EducationPregnancy },
  { path: '/education/prenatal-checkup', name: 'EducationPrenatalCheckup', component: EducationPrenatalCheckup },
  { path: '/postpartum', name: 'Postpartum', component: Postpartum },
  {
    path: '/self-assessment',
    component: SelfAssessment,
    children: [
      // 預設路徑導向說明頁
      { path: '', redirect: '/self-assessment/instructions' },
      { path: 'instructions', component: AssessmentInstructions },
      { path: 'prenatal', component: AssessmentPrenatal },
      { path: 'depression', component: AssessmentDepression },
      { path: 'history', component: AssessmentHistory },
      { path: 'history/:id', component: AssessmentHistoryDetail, props: true } // 允許將 id 作為 props 傳入元件
    ]
  },
  { path: '/timeline', name: 'Timeline', component: Timeline }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
