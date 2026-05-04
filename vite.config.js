import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// const repoName = 'MaternalHealthManagementSystem'; 

export default defineConfig({
  plugins: [vue()],
  base: '/maternal/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // 你的後端伺服器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // 保持 /api 路徑
        proxyTimeout: 15000, // 增加代理等待時間
        timeout: 15000,
      }
    }
  }
})
