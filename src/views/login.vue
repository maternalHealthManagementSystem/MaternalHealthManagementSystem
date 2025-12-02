<template>
  <div class="login-page">
    <h1>孕產婦健康照護管理</h1>

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
        <input
          v-model="smsCode"
          :class="{ error: smsError }"
          type="text"
          placeholder="請輸入驗證碼"
        />
        <p class="error-text" v-if="smsError">{{ smsError }}</p>

        <button class="text-button" @click="resendsms">重新寄送驗證碼</button>

        <button class="text-button" @click="resendPhoneInput">
          重新輸入手機電話號碼
        </button>

        <button class="button" @click="sendsms">驗證</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const idError = ref("");
const phoneError = ref("");
const smsError = ref("");

const router = useRouter();

// 輸入資料
const idNumber = ref("");
const phoneNumber = ref("");
const smsCode = ref("");

// 控制顯示
const showIdPhone = ref(true);

// 預設使用者資料
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
    dueDate: "2026/05/05",
    emergencyContact: "王大明",
    emergencyRelation: "配偶",
    emergencyPhone: "0923456789",
  },
};

// 驗證身分證與手機號碼
const verification = () => {
  idError.value = "";
  phoneError.value = "";

  const idPattern = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
  const phonePattern = /^09\d{8}$/;

  if (!idNumber.value) {
    idError.value = "請輸入身分證字號";
  } else if (!idPattern.test(idNumber.value)) {
    idError.value = "身分證字號格式錯誤(例:A123456789)";
  }

  if (!phoneNumber.value) {
    phoneError.value = "請輸入手機號碼";
  } else if (!phonePattern.test(phoneNumber.value)) {
    phoneError.value = "手機號碼格式錯誤(例:0912345678)";
  }

  // 若有任何錯誤,不進入下一步
  if (idError.value || phoneError.value) return;

  // 檢查是否為預設使用者
  if (
    idNumber.value === demoUser.idNumber &&
    phoneNumber.value === demoUser.phoneNumber
  ) {
    showIdPhone.value = false;
  } else {
    alert("此身分證字號或手機號碼尚未註冊,請聯絡系統管理員");
  }
};

// 重新寄送簡訊
const resendsms = () => {
  alert("驗證碼已重新寄送!");
};

// 驗證簡訊
const sendsms = () => {
  smsError.value = "";
  const smsPattern = /^\d{6}$/;

  if (!smsCode.value) {
    smsError.value = "請輸入驗證碼";
    return;
  }

  if (!smsPattern.test(smsCode.value)) {
    smsError.value = "驗證碼格式錯誤(六位數字,如 123456)";
    return;
  }

  // 驗證是否為預設使用者的驗證碼
  if (smsCode.value === demoUser.smsCode) {
    // 儲存登入狀態和使用者資料
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: demoUser.profile.name,
        email: demoUser.profile.email,
      })
    );
    localStorage.setItem("userProfile", JSON.stringify(demoUser.profile));

    // 成功登入
    router.push("/home");
  } else {
    smsError.value = "驗證碼錯誤，請重新輸入";
  }
};

// 重新輸入手機號碼
const resendPhoneInput = () => {
  showIdPhone.value = true;
  idNumber.value = "";
  phoneNumber.value = "";
  smsCode.value = "";
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
  font-size: 14px;
  margin-bottom: 6px;
  color: #374151;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 14px;
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
</style>
