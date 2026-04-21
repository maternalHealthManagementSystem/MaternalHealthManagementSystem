import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// const repoName = 'MaternalHealthManagementSystem'; 

export default defineConfig({
  plugins: [vue()],
  base: '/maternal/',
  server: {
    host: '0.0.0.0', // 允許區網內所有設備連線
    port: 5173,      // 你的埠號
    proxy: {
      '/api': {
        target: 'http://192.168.0.187:3002', // 後端伺服器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // 保持 /api 路徑
      }
    }
  }
})
