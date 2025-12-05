// import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// const repoName = 'MaternalHealthManagementSystem'; 

export default defineConfig({
  // base: `/${repoName}/`, // <-- 新增此行
  // plugins: [
  //   vue(),
  // ],
  plugins: [vue()],
  base: '/MaternalHealthManagementSystem/',
  // resolve: {
  //   alias: {
  //     // 設置 '@' 別名，指向專案的 'src' 資料夾
  //     '@': fileURLToPath(new URL('./src', import.meta.url))
  //   }
  // }
})
