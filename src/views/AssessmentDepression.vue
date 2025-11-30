<template>
  <AssessmentPanel title="愛丁堡產後憂鬱量表" subtitle="（請您依據過去七天內的感受進行填寫）">
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

    <div class="question-list">
      <div v-for="(q, index) in questions" :key="q.id" class="question-card">
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
    <FormFooter @submit="submitForm" />
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
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import AssessmentPanel from '@/components/AssessmentPanel.vue';
import AssessmentProgressBar from '@/components/AssessmentProgressBar.vue';
import FormFooter from '@/components/FormFooter.vue'; 
// 引入 JSON 資料檔
import depressionQuestions from '@/assets/data/depressionQuestions.json';
// 使用 JSON 資料初始化 questions
// 使用深拷貝確保每次進入頁面都是乾淨的狀態，不會被快取影響
const questions = reactive(JSON.parse(JSON.stringify(depressionQuestions)));

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
    // 之後加入實際送出給後端 API 的程式碼
    console.log('Form Data:', form);
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


/* RWD */
@media (max-width: 768px) {
  .options-container {
    flex-direction: column;
    gap: 5px;
  }
}
</style>