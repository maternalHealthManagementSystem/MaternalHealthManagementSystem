<template>
  <AssessmentPanel ref="panelRef" title="愛丁堡產後憂鬱量表" subtitle="（請您依據過去七天內的感受進行填寫）">
    <AssessmentProgressBar :completionRate="completionRate" />
    <div class="info-section">
      <div class="input-row">
        <label class="field-label">身分：</label>
        <div class="radio-group-inline">
          <label class="radio-pill">
            <input type="radio" v-model="form.identity" value="1"> 準媽媽
          </label>
          <label class="radio-pill">
            <input type="radio" v-model="form.identity" value="2"> 寶寶媽媽
          </label>
        </div>
      </div>

      <div class="input-row">
        <label class="field-label">預產期或寶寶生日：</label>
        <input type="date" v-model="form.date" class="date-input">
      </div>
    </div>

    <hr class="divider">

    <div v-show="currentStep === 1" class="question-list">
      <div v-for="q in questions.slice(0, 4)" :key="q.id" class="question-card">
        <p class="q-text">
          <span class="q-num">{{ q.id }}.</span> {{ q.text }}
        </p>
        
        <div class="options-container">
          <label 
            v-for="(opt, optIndex) in q.options" 
            :key="optIndex" 
            class="option-item"
            :class="{ 'selected': q.selectedVal === opt.value }"
          >
            <input 
              type="radio" 
              :name="`question-${q.id}`" 
              :value="opt.value" 
              v-model="q.selectedVal"
            >
            <span class="opt-text">{{ opt.text }}</span>
          </label>
        </div>
      </div>
    </div>
    <div v-show="currentStep === 2">
       <div class="question-list">
         <div v-for="q in questions.slice(4)" :key="q.id" class="question-card">
           <p class="q-text">
             <span class="q-num">{{ q.id }}.</span> {{ q.text }}
           </p>
           
           <div class="options-container">
             <label 
               v-for="(opt, optIndex) in q.options" 
               :key="optIndex" 
               class="option-item"
               :class="{ 'selected': q.selectedVal === opt.value }"
             >
               <input 
                 type="radio" 
                 :name="`question-${q.id}`" 
                 :value="opt.value" 
                 v-model="q.selectedVal"
               >
               <span class="opt-text">{{ opt.text }}</span>
             </label>
           </div>
         </div>
       </div>
    </div>

    <div class="navigation-buttons">
      <button 
        v-if="currentStep > 1" 
        class="nav-btn btn-prev" 
        @click="prevStep"
      >
        上一頁
      </button>
      
      <button 
        v-if="currentStep < totalSteps" 
        class="nav-btn btn-next" 
        @click="nextStep"
      >
        下一頁
      </button>
      
      <button 
        v-if="currentStep === totalSteps" 
        class="nav-btn btn-submit" 
        @click="submitForm"
      >
        送出表單
      </button>
    </div>
    <div v-if="showResultModal" class="modal-overlay">
      <div class="modal-box">
        <button class="modal-close" @click="closeModal">×</button>
        
        <div class="modal-content">
          <div class="score-circle" :class="scoreStatusClass">
            {{ totalScore }}
          </div>
          <h3 class="result-title">評估總分</h3>
          
          <div class="result-message-box">
            <p class="message-text">{{ resultMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </AssessmentPanel>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AssessmentPanel from '../components/AssessmentPanel.vue';
import AssessmentProgressBar from '../components/AssessmentProgressBar.vue';
// 引入 JSON 資料檔
import depressionQuestions from '../assets/data/depressionQuestions.json';
// 使用 JSON 資料初始化 questions
// 使用深拷貝確保每次進入頁面都是乾淨的狀態，不會被快取影響
const questions = reactive(JSON.parse(JSON.stringify(depressionQuestions)));
// 1. 定義分頁狀態 
const currentStep = ref(1);
const totalSteps = 2; // 共 2 頁
const panelRef = ref(null);
// 2. 下一頁函式
const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++;
    panelRef.value?.scrollToTop(); // 換頁後滾回頂部
  }
};

//  3. 上一頁函式 
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    panelRef.value?.scrollToTop();
  }
};

//  4. 分頁驗證邏輯 
const validateCurrentStep = () => {
  if (currentStep.value === 1) {
    // 檢查基本資料
    if (!form.identity) {
      alert('請填寫身分');
      return false;
    }
    if (!form.date) {
      alert('請填寫預產期或寶寶生日');
      return false;
    }

    // 檢查第 1~4 題 (對應陣列索引 0~3)
    // 使用 slice(0, 4) 取出前四題檢查
    const part1Questions = questions.slice(0, 4);
    const allAnswered = part1Questions.every(q => q.selectedVal !== null);

    if (!allAnswered) {
      alert('請完成本頁所有題目 (第 1 到第 4 題)');
      return false;
    }
  }
  // 第二頁的檢查在 submitForm 統一處理
  return true;
};

// ==========================================
// 網頁載入後，自動讀取 localStorage 資料
// ==========================================
onMounted(() => {
  const savedProfileStr = localStorage.getItem("userProfile");
  
  if (savedProfileStr) {
    try {
      const profile = JSON.parse(savedProfileStr);
      
      // 1. 處理日期 (預產期 dueDate)
      if (profile.dueDate) {
        // 資料庫格式通常是 YYYY/MM/DD，需轉換為 YYYY-MM-DD 才能放入 input type="date"
        const formattedDate = profile.dueDate.replace(/\//g, '-');
        form.date = formattedDate;

        // 2. 自動判斷身分 (邏輯：比較今天與預產期)
        const today = new Date();
        const targetDate = new Date(formattedDate);
        
        // 歸零時間，只比較日期
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        if (targetDate >= today) {
          // 如果預產期在今天之後 (或等於今天)，視為「準媽媽」
          form.identity = '1';
        } else {
          // 如果預產期已過，視為「寶寶媽媽」(此時該日期代表寶寶生日)
          form.identity = '2';
        }
      }
    } catch (e) {
      console.error("解析使用者資料失敗:", e);
    }
  }
});

// 表單基本資料
const form = reactive({
  identity: null, // 1:準媽媽, 2:寶寶媽媽
  date: ''
});

// 控制結果彈窗
const showResultModal = ref(false);

// 計算填寫進度百分比 (包含身分、日期與 10 題問卷)
const completionRate = computed(() => {
  let filledCount = 0;
  
  // 1. 檢查身分
  if (form.identity) filledCount++;
  
  // 2. 檢查日期
  if (form.date) filledCount++;
  
  // 3. 檢查 10 題問卷
  const answeredQuestions = questions.filter(q => q.selectedVal !== null).length;
  filledCount += answeredQuestions;

  // 總項目 = 2 (基本資料) + 題目數量
  const totalItems = 2 + questions.length; 
  
  return Math.round((filledCount / totalItems) * 100);
});

// 計算總分
const totalScore = computed(() => {
  return questions.reduce((sum, q) => sum + (q.selectedVal || 0), 0);
});

// 判斷結果訊息
const resultMessage = computed(() => {
  const score = totalScore.value;
  if (score >= 13) {
    return '您的分數偏高，顯示您可能有產後憂鬱的傾向，強烈建議您儘快尋求專科醫師的協助與處理。';
  } else if (score >= 10) {
    return '您的情緒狀態需多加注意，建議近期內再次進行評估，或諮詢專科醫師進行追蹤。';
  } else {
    return '目前情緒狀態穩定，請繼續保持愉悅的心情，並適度休息。';
  }
});

// 判斷結果顏色 Class
const scoreStatusClass = computed(() => {
  const score = totalScore.value;
  if (score >= 13) return 'status-danger';
  if (score >= 10) return 'status-warning';
  return 'status-normal';
});

// 送出函式
const submitForm = () => {
  if (!form.identity) {
    alert('請填寫身分');
    return;
  }else if( !form.date){
    alert('請填寫預產期');
    return;
  }else if (completionRate.value < 100) {
    alert('您還有題目尚未完成，請檢查所有題目。');
    return;
  }else{
    // 取得當下的結果評語
    const currentMessage = resultMessage.value; 

    // 組裝要儲存的內容
    const record = {
      id: Date.now(),
      title: "愛丁堡產後憂鬱量表",
      type: 'depression', 
      date: new Date().toLocaleDateString(), // 格式化日期
      
      // 儲存表單資料
      form: { ...form }, 
      questions: JSON.parse(JSON.stringify(questions)), // 儲存答題內容
      totalScore: totalScore.value, // 儲存總分
      message: currentMessage // 把評語存起來
    };
    const historyData = JSON.parse(localStorage.getItem("assessment_history") || "[]");
    
    historyData.unshift(record);
    localStorage.setItem("assessment_history", JSON.stringify(historyData));
    // 顯示結果彈窗
    showResultModal.value = true;
  }
};

const router = useRouter();
// 關閉函式
const closeModal = () => {
  showResultModal.value = false;
  // 跳轉至歷史填寫紀錄頁面
  router.push('/self-assessment/history');
};
</script>

<style scoped>
/* 🔥🔥🔥 [新增] 按鈕樣式 🔥🔥🔥 */
.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px 0;
}

.nav-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn-prev {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-next {
  background-color: #3498db;
  color: white;
}

.btn-submit {
  background-color: #3498db;
  color: white;
}
/* --- 上方基本資訊區 --- */
.info-section {
  padding: 10px 20px;
  background-color: transparent;
}

.input-row {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.field-label {
  font-size: 16px;
  font-weight: bold;
  color: #2d3748;
  width: 150px; /* 固定寬度讓標題對齊 */
  flex-shrink: 0;
}

.radio-group-inline {
  display: flex;
  gap: 15px;
}

.radio-pill {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #555;
}

.radio-pill input {
  margin-right: 5px;
}

.date-input {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
}

.divider {
  border: 0;
  border-top: 1px solid #cbd5e0;
  margin: 10px 0 20px 0;
}

/* --- 題目列表區 --- */
.question-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  background-color: white; /* 讓每題有白色背景，增加層次 */
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.q-text {
  font-size: 16px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 15px;
}

.q-num {
  margin-right: 5px;
}

.options-container {
  display: flex;
  flex-wrap: wrap; /* 手機版自動換行 */
  gap: 15px;
}

.option-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
  margin-right: 15px;
}

.option-item input {
  margin-right: 6px;
  /* 圓圈選取顏色 */
  /* accent-color: #5a6b7c; */
}

.opt-text {
  color: #555;
  font-size: 15px;
}

/* --- 結果彈窗樣式 --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-box {
  background-color: white;
  width: 360px;
  padding: 40px 30px;
  border-radius: 8px;
  position: relative;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.modal-close {
  position: absolute;
  top: 10px; right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.score-circle {
  width: 80px; height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin: 0 auto 15px auto;
}

.status-normal { background-color: #27ae60; }   /* 綠色 */
.status-warning { background-color: #f39c12; }  /* 橘色 */
.status-danger { background-color: #c0392b; }   /* 紅色 */

.result-title {
  margin: 0 0 15px 0;
  color: #333;
}

.result-message-box {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: left;
}

.message-text {
  color: #555;
  line-height: 1.6;
  margin: 0;
}


/* =========================================
   2. iPad Air & Tablet (寬度 769px ~ 1024px)
   ========================================= */
@media (max-width: 1024px) {
  .info-section {
    padding: 0 10px;
  }
  
  /* 選項改為 Grid 雙欄排列，比較整齊 */
  .options-container {
    display: grid;
    grid-template-columns: 1fr 1fr; /* 左右各一個 */
    gap: 12px;
  }
  
  .option-item {
    justify-content: flex-start;
    background-color: #f9fbfd; /* 給一個淡底色區分 */
    padding: 10px;
  }
}

/* =========================================
   3. iPhone 12/14 Pro/Max & Mobile (寬度 <= 768px)
   ========================================= */
@media (max-width: 768px) {
  .navigation-buttons {
    flex-direction: column-reverse;
    gap: 15px;
  }
  .nav-btn {
    width: 100%;
  }
  /* 輸入列改為垂直堆疊 */
  .input-row {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 25px;
  }

  .field-label {
    width: 100%;
    margin-bottom: 10px;
    font-size: 16px;
  }

  /* 身分選擇按鈕排版：改為滿版按鈕 */
  .radio-group-inline {
    width: 100%;
    gap: 12px;
  }
  
  .radio-pill {
    flex: 1; /* 兩個按鈕平分寬度 */
    justify-content: center; /* 文字置中 */
    padding: 12px;
    border-radius: 8px;
    border: 1px solid transparent;
  }
  
  /* 選中時增加邊框提示 */
  .radio-pill:has(input:checked) {
    background-color: #ebf8ff;
    border-color: #bee3f8;
    color: #2b6cb0;
  }

  /* 日期輸入框滿版 */
  .date-input {
    width: 100%;
    font-size: 16px; /* 防止 iOS Safari 自動放大 */
    padding: 12px;
    box-sizing: border-box; /* 確保 padding 不撐開 */
  }

  /* 題目卡片優化 */
  .question-card {
    padding: 20px 15px; /* 左右內距縮小 */
  }

  /* 選項改為單欄垂直堆疊 (手指好點) */
  .options-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .option-item {
    width: 100%;
    padding: 12px 15px; /* 增加觸控高度 */
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-sizing: border-box;
  }
  
  /* 選中時的效果 */
  .option-item.selected {
    background-color: #ebf8ff;
    border-color: #3498db;
  }

  /* 選項文字大小 */
  .opt-text {
    font-size: 16px;
    line-height: 1.4;
  }

  /* Radio 按鈕加大 */
  .option-item input, .radio-pill input {
    width: 22px;
    height: 22px;
    margin-right: 12px;
  }

  /* 彈窗調整 */
  .modal-box {
    width: 85%; /* 改為百分比寬度 */
    padding: 30px 20px;
  }
}
</style>