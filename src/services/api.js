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
    console.log("收到錯誤回應:", err.response?.status);

    // 處理網路斷線或無回應
    if (!err.response) {
      ElMessage.error("網路異常，請檢查連線");
      return Promise.reject(err);
    }

    const status = err.response.status;

    // 處理 401 (Token 過期) 或 403 (無權限)
    if ((status === 401 || status === 403) && !isRedirecting) {
      console.log("偵測到 Token 過期，準備彈窗...");

      isRedirecting = true; // 鎖定，防止多個請求同時失敗彈出多個視窗

      try {
        // 使用 await 確保使用者點擊「確定」後才執行後續動作
        await ElMessageBox.alert(
          "登入已逾時，請重新登入",
          "系統通知",
          {
            confirmButtonText: "確定",
            type: "warning",
            callback: () => {
              // 點擊確定後的執行邏輯
              localStorage.removeItem("token");
              sessionStorage.clear(); // 清除暫存資訊
              isRedirecting = false;
              router.push("/login");
            }
          }
        );
      } catch (error) {
        // 如果使用者直接關閉視窗也要處理
        isRedirecting = false;
        router.push("/login");
      }
      
      return Promise.reject(err);
    } 

    // 處理 500 以上錯誤
    if (status >= 500) {
      ElMessage.error("伺服器錯誤，請稍後再試");
    }

    return Promise.reject(err);
  }
);

export default api;