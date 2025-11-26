import { createRouter, createWebHistory } from 'vue-router'
import PregnancyDiary from '@/views/PregnancyDiary.vue'

const routes = [
  {
    path: '/Calendar-Diary',
    name: 'PregnancyDiary',
    component: PregnancyDiary
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router