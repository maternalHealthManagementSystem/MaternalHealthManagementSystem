<template>
  <div class="login-page">
    <h1>孕產婦健康照護管理系統</h1>

    <div class="login-box">
      <div v-show="showIdPhone">
        <label>身分證字號</label>
        <input
          v-model="idNumber"
          :class="{ error: idError }"
          type="text"
          placeholder="請輸入身分證字號"
        />
        <p class="error-text" v-if="idError">{{ idError }}</p>
      </div>

      <div v-show="showIdPhone">
        <label>手機號碼</label>
        <input
          v-model="phoneNumber"
          :class="{ error: phoneError }"
          type="text"
          placeholder="請輸入手機號碼"
        />
        <p class="error-text" v-if="phoneError">{{ phoneError }}</p>
      </div>

      <button v-show="showIdPhone" @click="verification">傳送簡訊驗證</button>

      <div v-show="!showIdPhone">

        <p v-if="demoMode && demoSMSDisplay" style="color: red; font-size: 14px; margin-bottom: 10px;">
          驗證碼：{{ demoSMSDisplay }}
        </p>

        <input
          v-model="smsCode"
          :class="{ error: smsError }"
          type="text"
          placeholder="請輸入驗證碼"
        />
        <p class="error-text" v-if="smsError">{{ smsError }}</p>
        
        <button 
          class="text-button" 
          @click="resendsms" 
          :disabled="isCounting"
          :style="{ cursor: isCounting ? 'not-allowed' : 'pointer', color: isCounting ? '#aaa' : '#007bff' }"
        >
          {{ isCounting ? `${countdown} 秒後重新寄送` : '重新寄送驗證碼' }}
        </button>
        <button class="text-button" @click="resendPhoneInput">重新輸入手機電話號碼</button>
        <button class="button" @click="sendsms">驗證</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const demoMode = false; // 建議接後端時關閉 demo

// 狀態控制
const showIdPhone = ref(true);
const isCounting = ref(false);
const countdown = ref(60);
let timer = null;

// 表單資料
const idNumber = ref("");
const phoneNumber = ref("");
const smsCode = ref("");

// 錯誤訊息
const idError = ref("");
const phoneError = ref("");
const smsError = ref("");

// 1. 啟動倒數計時
const startCountdown = () => {
  if (timer) clearInterval(timer);
  isCounting.value = true;
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      isCounting.value = false;
    }
  }, 1000);
};

// 2. 第一步：請求驗證碼 (verification)
const verification = async () => {
  idError.value = "";
  phoneError.value = "";

  try {
    const res = await api.post("/api/auth/request-otp", {
      national_id: idNumber.value,
      phone_number: phoneNumber.value,
    });

    if (res.data.success) {
      localStorage.setItem("temp_user_id", res.data.user_id);
      showIdPhone.value = false;
      startCountdown();
    }
  } catch (err) {
    idError.value = err.response?.data?.message || "發送失敗，請檢查資料";
  }
};

// 3. 第二步：驗證驗證碼並登入 (sendsms)
const sendsms = async () => {
  const tempId = localStorage.getItem("temp_user_id"); 
  
  if (!tempId) {
    smsError.value = "請先獲取驗證碼";
    return;
  }

  smsError.value = "";
  try {
    const res = await api.post("/api/auth/verify-otp", {
      user_id: tempId, 
      otp: smsCode.value,
    });

    if (res.data.success) {
      // 登入成功，儲存使用者資訊並導向首頁(在localstorage)
      // 儲存完整 user 物件（包含 user_id, name, national_id, phone_number）
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      
      // 儲存 App.vue 側邊欄專用的基本資訊
      sessionStorage.setItem("currentUser", JSON.stringify({
        name: res.data.user.name,
        email: res.data.user.email || "",
      }));

      sessionStorage.setItem("loggedIn", "true");
      router.push("/home");
    }
  } catch (err) {
    smsError.value = err.response?.data?.message || "驗證碼錯誤";
  }
};

// 4. 重新寄送驗證碼
const resendsms = async () => {
  if (isCounting.value) return;
  await verification(); // 直接複用請求邏輯
};

// 5. 回到上一步
const resendPhoneInput = () => {
  showIdPhone.value = true;
  smsCode.value = "";
  if (timer) clearInterval(timer);
  isCounting.value = false;
};

// 組件卸載時清除計時器避免記憶體洩漏
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>


<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #ffffff;
  font-family: Arial, sans-serif;

  /*動畫 */
  /* 1. 定義漸層背景 */
  background: linear-gradient(120deg, #c6eedf, #65b1dd);

  /* 2. 設定背景尺寸放大，為動畫提供空間 */
  background-size: 300% 300%;

  /* 4. 應用動畫 */
  animation: my-animation 5s ease infinite; /* 動畫名稱、時間、時間函式、無限循環 */
}
/* 3. 定義動畫的關鍵影格 */
@keyframes my-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 80% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

h1 {
  font-size: 36px;
  color: #36404a;
  margin-bottom: 40px;
  font-weight: 700;
}

.login-box {
  width: 380px;
  background: #f1f5f9;
  border: 1px solid #d1d5db;
  padding: 30px;
  border-radius: 6px;
  box-sizing: border-box;
}

label {
  display: block;
  font-size: 20px;
  margin-bottom: 6px;
  color: #374151;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 20px;
  box-sizing: border-box;
}

.text-button {
  background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
}

.text-button:hover {
  background: none;
}

button {
  width: 100%;
  background: #475569;
  color: white;
  padding: 10px;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background: #334155;
}

.error {
  border: 1px solid #e11d48 !important; /* 深紅色 */
  background: #ffeef0;
}

.error-text {
  color: #e11d48;
  font-size: 12px;
  margin-top: -5px;
  margin-bottom: 10px;
}

/* text-button 禁用狀態 */
.text-button[disabled] {
  color: #aaa !important; /* 灰色 */
  cursor: not-allowed !important;
  text-decoration: none !important; /* 移除底線 */
}
/* 手機響應式調整 */
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }

  h1 {
    font-size: 28px;
    margin-bottom: 30px;
  }

  label, input, button {
    font-size: 18px;
  }
}
</style>