import axios from "axios";
import router from "../router/index.js";
import { ElMessageBox, ElMessage } from "element-plus"; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

// 標記是否正在跳轉，避免重複彈出多個視窗
let isRedirecting = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // 取得請求的 URL
    const config = err.config;
    const status = err.response?.status;

    // 1. 處理網路斷線或無回應
    if (!err.response) {
      ElMessage.error("網路異常，請檢查連線");
      return Promise.reject(err);
    }

    // 2. 判斷是否為「登入/身分驗證」相關的 API 請求
    // 如果是 auth 相關路徑，不執行全局的 401 彈窗邏輯
    const isAuthRequest = config.url.includes('/api/auth/');

    // 3. 處理 401 (Token 過期) 或 403 (無權限)
    if ((status === 401 || status === 403) && !isRedirecting) {
      
      // 重要：如果是登入請求發生的 401 (代表身分證/電話錯誤)，直接回傳 Error
      if (isAuthRequest) {
        return Promise.reject(err);
      }

      // 只有在「非登入頁面」且「有 Token 但過期」的情況下才彈窗
      console.log("偵測到 Token 過期，準備彈窗...");
      isRedirecting = true; 

      try {
        await ElMessageBox.alert(
          "登入已逾時，請重新登入",
          "系統通知",
          {
            confirmButtonText: "確定",
            type: "warning",
            callback: () => {
              localStorage.removeItem("token");
              sessionStorage.clear(); 
              isRedirecting = false;
              router.push("/login");
            }
          }
        );
      } catch (error) {
        isRedirecting = false;
        router.push("/login");
      }
      
      return Promise.reject(err);
    } 

    // 4. 處理 429 頻率限制 (如果不是 auth 請求才在這邊處理，auth 請求由頁面處理)
    if (status === 429 && !isAuthRequest) {
      ElMessage.warning("操作過於頻繁，請稍後再試");
    }

    // 5. 處理 500 以上錯誤
    if (status >= 500) {
      ElMessage.error("伺服器錯誤，請稍後再試");
    }

    return Promise.reject(err);
  }
);

export default api;