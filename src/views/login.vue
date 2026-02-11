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
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

// 🔥 是否開啟 Demo 模式（展示用）
const demoMode = true;

// ----------------------
// 倒數計時狀態 (新增)
// ----------------------
const initialTime = 60;
const countdown = ref(initialTime);
const isCounting = ref(false);
let timer = null; // 用於儲存計時器

// ----------------------
// 欄位錯誤訊息
// ----------------------
const idError = ref("");
const phoneError = ref("");
const smsError = ref("");

// ----------------------
// 表單欄位資料
// ----------------------
const idNumber = ref("");
const phoneNumber = ref("");
const smsCode = ref("");

const router = useRouter();
const showIdPhone = ref(true);

// 🔥 Demo 用驗證碼顯示
const demoSMSDisplay = ref("");

// ----------------------
// Demo 使用者資料
// ----------------------
const demoUser = {
  idNumber: "A123456789",
  phoneNumber: "0912345678",
  smsCode: "123456",
  profile: {
    name: "王小美",
    email: "wang.xiaomay@example.com",
    mobile: "0912345678",
    landline: "0212345678",
    dob: "1990/05/15",
    bloodType: "A型",
    height: "165",
    weight: "58",
    address: "台北市中正區仁愛路一段100號4樓",
    dueDate: "2026/05/05",
    emergencyContact: "王大明",
    emergencyRelation: "配偶",
    emergencyPhone: "0923456789",
  },
};

// ----------------------
// ⭐ 產生 Demo 用的驗證碼
// ----------------------
const generateDemoSMS = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6位數字
  localStorage.setItem("demoSMSCode", code);
  demoSMSDisplay.value = code;
  return code;
};

// ----------------------
// ⭐ 啟動倒數計時 (新增)
// ----------------------
const startCountdown = () => {
  // 先清除舊的計時器
  if (timer) clearInterval(timer);
  
  isCounting.value = true;
  countdown.value = initialTime;

  timer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(timer);
      isCounting.value = false;
    }
  }, 1000);
};


// ----------------------
// 送出驗證碼 (修改：成功後開始倒數)
// ----------------------
const verification = async () => {
  idError.value = "";
  phoneError.value = "";

  const idPattern = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
  const phonePattern = /^09\d{8}$/;

  if (!idNumber.value) idError.value = "請輸入身分證字號";
  else if (!idPattern.test(idNumber.value))
    idError.value = "身分證字號格式錯誤(例:A123456789)";

  if (!phoneNumber.value) phoneError.value = "請輸入手機號碼";
  else if (!phonePattern.test(phoneNumber.value))
    phoneError.value = "手機號碼格式錯誤(例:0912345678)";

  if (idError.value || phoneError.value) return;

  // ⭐ 直接呼叫後端登入（暫時不走 SMS）
  try {
    const res = await api.post("/api/auth/login", {
      national_id: idNumber.value,
      phone_number: phoneNumber.value,
    });

    if (res.data?.success) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user_id", res.data.user.user_id);

      alert("登入成功！");
      router.push("/home");
    }
  } catch (err) {
    const errorMsg =
      err.response?.data?.message || "登入失敗，請檢查帳號";
    alert(errorMsg);
  }
};


// ----------------------
// 重新寄送驗證碼 (修改：只有非倒數狀態下才能重新寄送)
// ----------------------
const resendsms = () => {
  if (isCounting.value) {
    return; // 正在倒數中，不執行任何操作
  }
  
  // ⭐ 重新寄送並開始倒數
  if (demoMode) {
    const code = generateDemoSMS();
    alert(`驗證碼已重新寄送：${code}`);
  }
  startCountdown();
};

// ----------------------
// 驗證簡訊
// ----------------------
const sendsms = async () => {
  smsError.value = "";
  const smsPattern = /^\d{6}$/;

  if (!smsCode.value) {
    smsError.value = "請輸入驗證碼";
    return;
  }

  if (!smsPattern.test(smsCode.value)) {
    smsError.value = "驗證碼格式錯誤(六位數字)";
    return;
  }

  // 驗證碼比對
  const savedCode = localStorage.getItem("demoSMSCode");
  if (smsCode.value !== savedCode) {
    smsError.value = "驗證碼錯誤";
    return;
  }

  // 3. 通過驗證，呼叫後端登入 API
  try {
    // 這裡使用你上方 import 的 api 物件
    const res = await api.post("/api/auth/login", {
      national_id: idNumber.value,
      phone_number: phoneNumber.value,
    });

    // 假設後端回傳成功 (res.data 包含用戶資訊)
    if (res.data?.success) {
      // 停止計時器
      if (timer) clearInterval(timer); 

      // 儲存登入狀態與資料
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("justLoggedIn", "true");
      // login 成功後
      localStorage.setItem('user_id', res.data.user.user_id);

      
      // 建議儲存後端回傳的真實資料，而非 demoUser
      localStorage.setItem("userProfile", JSON.stringify(res.data.user || res.data));

      alert("登入成功！");
      router.push("/home");
    }
  } catch (err) {
    console.error("Login Error:", err);
    // 處理錯誤訊息
    const errorMsg = err.response?.data?.message || "登入失敗，請檢查網路連線";
    alert(errorMsg);
  }
};

// ----------------------
// 回到輸入手機 (修改：清除計時器和狀態)
// ----------------------
const resendPhoneInput = () => {
  showIdPhone.value = true;
  idNumber.value = "";
  phoneNumber.value = "";
  smsCode.value = "";
  demoSMSDisplay.value = "";
  
  // ⭐ 清除計時器狀態
  if (timer) clearInterval(timer);
  isCounting.value = false;
  countdown.value = initialTime;
};
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
