import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import profile from '../views/profile.vue'
import prenatal from '../views/prenatal.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: login     // ← 預設載入 Login
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile
  },
  {
    path: '/prenatal',
    name: 'prenatal',
    component: prenatal
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
