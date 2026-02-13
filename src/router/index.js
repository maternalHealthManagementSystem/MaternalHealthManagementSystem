import { createRouter, createWebHashHistory } from "vue-router";
import login from "../views/login.vue";
import home from "../views/home.vue";
import profile from "../views/profile.vue";
import prenatal from "../views/prenatal.vue";
import PregnancyDiary from "../views/PregnancyDiary.vue";
import Education from "../views/Education.vue";
import EducationPregnancy from "../views/EducationPregnancy.vue";
import EducationPrenatalCheckup from "../views/EducationPrenatalCheckup.vue";
import Postpartum from "../views/Postpartum.vue";
import SelfAssessment from "../views/SelfAssessment.vue";
import AssessmentInstructions from "../views/AssessmentInstructions.vue";
import AssessmentPrenatal from "../views/AssessmentPrenatal.vue";
import AssessmentDepression from "../views/AssessmentDepression.vue";
import AssessmentHistory from "../views/AssessmentHistory.vue";
import AssessmentHistoryDetail from "../views/AssessmentHistoryDetail.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: login, // ← 預設載入 Login
  },
  {
    path: "/home",
    name: "home",
    component: home,
  },
  {
    path: "/profile",
    name: "profile",
    component: profile,
  },
  {
    path: "/prenatal",
    name: "prenatal",
    component: prenatal,
  },
  {
    path: "/Calendar-Diary",
    name: "PregnancyDiary",
    component: PregnancyDiary,
  },
  { 
    path: "/education", 
    name: "Education", 
    component: Education 
  },
  {
    path: "/education/pregnancy",
    name: "EducationPregnancy",
    component: EducationPregnancy,
  },
  {
    path: "/education/prenatal-checkup",
    name: "EducationPrenatalCheckup",
    component: EducationPrenatalCheckup,
  },
  { 
    path: "/postpartum", 
    name: "Postpartum", 
    component: Postpartum 
  },
  {
    path: "/self-assessment",
    component: SelfAssessment,
    children: [
      // 預設路徑導向說明頁
      { path: "", redirect: "/self-assessment/instructions" },
      { path: "instructions", component: AssessmentInstructions },
      { path: "prenatal", component: AssessmentPrenatal },
      { path: "depression", component: AssessmentDepression },
      { path: "history", component: AssessmentHistory },
      { path: "history/:id", component: AssessmentHistoryDetail, props: true }, // 允許將 id 作為 props 傳入元件
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory('/MaternalHealthManagementSystem/'), //加入儲存庫名稱
  routes,
});

export default router;


//登入後才可以訪問其他頁面，否則導回登入頁
router.beforeEach((to, from, next) => {
  const publicPages = ['login']; 
  const authRequired = !publicPages.includes(to.name);
  
  // 修正這裡：檢查 login.vue 存入的 'user'
  const isLoggedIn = localStorage.getItem('user'); 

  if (authRequired && !isLoggedIn) {
    console.warn("未偵測到登入資訊，跳回登入頁");
    return next({ name: 'login' });
  }

  if (!authRequired && isLoggedIn) {
    return next({ name: 'home' });
  }

  next();
});