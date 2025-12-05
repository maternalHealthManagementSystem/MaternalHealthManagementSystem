<template>
    <AssessmentPanel title="孕婦產前健康照護衛教指導紀錄表" subtitle="( 適用週數：第 29 週 ~ 第 40 週 )">
        <AssessmentProgressBar :completionRate="completionRate" />
        <div class="form-card">
            <div class="card-label">基本資料</div>
            <div class="card-body">
                <div class="row">
                    <div class="form-group col-6">
                        <label>姓名</label>
                        <input type="text" v-model="form.name" placeholder="請輸入姓名">
                    </div>
                    <div class="form-group col-6">
                        <label>身分證字號(外籍人士護照號碼)</label>
                        <input type="text" v-model="form.idNumber" placeholder="請輸入身分證字號">
                    </div>
                </div>
            
                <div class="row">
                    <div class="form-group col-6">
                        <label>出生日期</label>
                        <input type="date" v-model="form.birthDate">
                    </div>
                    <div class="form-group col-6">
                        <label>聯絡地址</label>
                        <input type="text" v-model="form.address" placeholder="請輸入聯絡地址">
                    </div>
                </div>

                <div class="row">
                    <div class="form-group col-6">
                        <label>手機號碼</label>
                        <input type="tel" v-model="form.phone" placeholder="09xx-xxx-xxx">
                    </div>
                    <div class="form-group col-6">
                        <label>住家電話</label>
                        <input type="tel" v-model="form.homePhone" placeholder="請輸入住家電話">
                    </div>
                
                </div>
            </div>
        </div>

        <div class="form-card">
            <div class="card-label">健康行為</div>
            <div class="card-body">
            
                <div class="question-item">
                    <p class="q-title">1. 您目前是否吸菸？</p>
                    <div class="radio-group">
                        <label><input type="radio" v-model="form.behavior.smoking" :value="0">否</label>
                        <label><input type="radio" v-model="form.behavior.smoking" :value="1">偶爾或應酬才吸</label>
                        <label><input type="radio" v-model="form.behavior.smoking" :value="2">平均一天約吸一包菸(20支含)以下</label>
                        <label><input type="radio" v-model="form.behavior.smoking" :value="3">平均一天約吸一包菸以上</label>
                    </div>
                </div>

                <div class="question-item">
                    <p class="q-title">2. 您是否特別注意遠離二手菸的環境？</p>
                    <div class="radio-group">
                        <label><input type="radio" v-model="form.behavior.secondhandSmoke" :value="0">否</label>
                        <label><input type="radio" v-model="form.behavior.secondhandSmoke" :value="1">是</label>
                        <label><input type="radio" v-model="form.behavior.secondhandSmoke" :value="2">周遭環境沒有二手菸</label>
                    </div>
                </div>

                <div class="question-item">
                    <p class="q-title">3. 您目前是否喝酒？</p>
                    <div class="radio-group">
                        <label><input type="radio" v-model="form.behavior.drinking" :value="0">否</label>
                        <label><input type="radio" v-model="form.behavior.drinking" :value="1">偶爾或應酬才喝</label>
                        <label><input type="radio" v-model="form.behavior.drinking" :value="2">經常喝</label>
                    </div>
                </div>

                <div class="question-item">
                    <p class="q-title">4. 您是否嚼檳榔？</p>
                    <div class="radio-group">
                        <label><input type="radio" v-model="form.behavior.betelNut" :value="0">否</label>
                        <label><input type="radio" v-model="form.behavior.betelNut" :value="1">偶爾或應酬才嚼</label>
                        <label><input type="radio" v-model="form.behavior.betelNut" :value="2">經常嚼</label>
                    </div>
                </div>

                <div class="question-item">
                    <p class="q-title">5. 您是否曾使用毒品？</p>
                    <div class="radio-group">
                        <label><input type="radio" v-model="form.behavior.drugs" :value="0">否</label>
                        <label><input type="radio" v-model="form.behavior.drugs" :value="1">是</label>
                    </div>
                </div>

                <div class="question-item">
                    <p class="q-title">6. 憂鬱檢測：</p>
                    
                    <div class="sub-question-block">
                        <p class="sub-q-text">過去一個月，是否常被情緒低落、憂鬱或感覺未來沒有希望所困擾？</p>
                        <div class="radio-group">
                            <label><input type="radio" v-model="form.behavior.depression1" :value="0"> 否</label>
                            <label><input type="radio" v-model="form.behavior.depression1" :value="1"> 是</label>
                        </div>
                    </div>

                    <div class="sub-question-block">
                        <p class="sub-q-text">過去一個月，是否常對事物失去興趣或做事沒有愉悅感？</p>
                        <div class="radio-group">
                            <label><input type="radio" v-model="form.behavior.depression2" :value="0"> 否</label>
                            <label><input type="radio" v-model="form.behavior.depression2" :value="1"> 是</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-card">
            <div class="card-label">孕產婦醫療史</div>
            <div class="card-body">
                <p class="q-title">過去是否有相關孕產醫療史？</p>
                <div class="radio-group mb-3">
                    <label><input type="radio" v-model="form.medicalHistory.hasHistory" :value="false"> 否</label>
                    <label><input type="radio" v-model="form.medicalHistory.hasHistory" :value="true">是 (請勾選下方項目)</label>
                </div>

                <div v-if="form.medicalHistory.hasHistory" class="history-checklist">
                    <div class="history-grid mb-4">
                        <label v-for="item in generalMedicalOptions" :key="item.id" class="check-label">
                            <input type="checkbox" v-model="form.medicalHistory.selectedItems" :value="item.id">
                            {{ item.label }}
                            <input 
                                v-if="item.id === '11' && form.medicalHistory.selectedItems.includes('11')"
                                type="text" 
                                v-model="form.medicalHistory.otherNote" 
                                class="inline-input" 
                                placeholder="請說明"
                                @click.stop
                            >
                        </label>
                    </div>

                    <transition name="slide-fade">
                        <div v-if="isSevereComplicationChecked" class="complication-section">
                            <p class="complication-title">請勾選嚴重合併症細項：</p>
                            <div class="history-grid">
                                <label v-for="item in seriousComplications" :key="item.id" class="check-label">
                                    <input type="checkbox" v-model="form.medicalHistory.selectedItems" :value="item.id">
                                    {{ item.label }}
                                </label>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <div class="form-card">
            <div class="card-label">衛教指導</div>
            <div class="card-body">
                <p class="hint-text">請準媽媽自我評估是否清楚下列指導重點：</p>
                
                <div v-for="(topic, index) in educationTopics" :key="index" class="edu-topic">
                    <h4 class="topic-title">{{ topic.title }}</h4>
                    <div class="topic-items">
                        <div v-for="(point, pIndex) in topic.points" :key="pIndex" class="edu-item-row">
                            <p class="edu-text">{{ point.text }}</p>
                            
                            <div class="edu-radio-group">
                                <label class="radio-label">
                                    <input 
                                        type="radio" 
                                        :name="`edu-${index}-${pIndex}`" 
                                        v-model="point.value" 
                                        :value="1"
                                    > 
                                    清楚
                                </label>
                                <label class="radio-label">
                                    <input 
                                        type="radio" 
                                        :name="`edu-${index}-${pIndex}`" 
                                        v-model="point.value" 
                                        :value="0"
                                    > 
                                    不清楚
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <FormFooter @submit="submitForm" />
        <div v-if="showSuccessModal" class="modal-overlay">
        
            <div class="modal-box">
                <button class="modal-close" @click="closeModal">×</button>

                <div class="modal-content">
                    <img :src="successImage" alt="送出成功" class="modal-icon" />
                    <h3 class="modal-title" style="color: #333;">送出成功</h3>
                </div>
            </div>
        </div>
    </AssessmentPanel>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import successImage from '../assets/success.png';
import AssessmentPanel from '../components/AssessmentPanel.vue';
import AssessmentProgressBar from '../components/AssessmentProgressBar.vue';
import FormFooter from '../components/FormFooter.vue';
// 引入 JSON 資料
import prenatalQuestions from '../assets/data/prenatalQuestions.json'; 
// 使用 JSON 資料初始化變數
const generalMedicalOptions = prenatalQuestions.generalMedicalOptions;
const seriousComplications = prenatalQuestions.seriousComplications;
// 注意：因為 educationTopics 裡的 value 需要響應式 (v-model 綁定)
// 所以建議用 reactive 包起來，或是深拷貝一份
const educationTopics = reactive(JSON.parse(JSON.stringify(prenatalQuestions.educationTopics)));

// 表單資料模型
const form = reactive({
  name: '',
  idNumber: '',
  birthDate: '',
  phone: '',
  homePhone: '', 
  address: '',   
  behavior: {
    smoking: null,
    secondhandSmoke: null,
    drinking: null,
    betelNut: null,
    drugs: null,    
    depression1: null,
    depression2: null
  },
  medicalHistory: {
    hasHistory: null,
    selectedItems: [],
    otherNote: '',
  }
});

// 計算填寫進度
const completionRate = computed(() => {
  let filledCount = 0;
  let totalCount = 0;

  // 1. 檢查基本資料 (6項)
  const basicFields = ['name', 'idNumber', 'birthDate', 'phone', 'homePhone', 'address'];
  basicFields.forEach(field => {
    totalCount++;
    if (form[field] && form[field].trim() !== '') filledCount++;
  });

  // 2. 檢查健康行為 (5項習慣 + 2項憂鬱 = 7項)
  // Radio Button，值為 0 或 1 都算已填，只有 null 算未填
  const behaviorFields = ['smoking', 'secondhandSmoke', 'drinking', 'betelNut', 'drugs', 'depression1', 'depression2'];
  behaviorFields.forEach(field => {
    totalCount++;
    if (form.behavior[field] !== null) filledCount++;
  });

  // 3. 檢查醫療病史 (1項)
  // 只檢查最外層的「是否有病史」開關
  totalCount++;
  if (form.medicalHistory.hasHistory !== null) filledCount++;

  // 4. 檢查衛教指導 (5大題共 11小題)
  educationTopics.forEach(topic => {
    topic.points.forEach(point => {
      totalCount++;
      if (point.value !== null) filledCount++;
    });
  });

  // 計算百分比
  if (totalCount === 0) return 0;
  return Math.round((filledCount / totalCount) * 100);
});

// 判斷是否勾選了第 8 項
const isSevereComplicationChecked = computed(() => {
  return form.medicalHistory.selectedItems.includes('8');
});

// 初始化 router
const router = useRouter();
// 控制彈窗顯示的狀態
const showSuccessModal = ref(false);

// 送出表單的函式
const submitForm = () => {
    // 定義基本資料的欄位
    const basicFields = ['name', 'idNumber', 'birthDate', 'phone', 'homePhone', 'address'];
    // 檢查基本資料是否有缺漏
    const isBasicInfoIncomplete = basicFields.some(field => !form[field] || form[field].trim() === '');

    if(isBasicInfoIncomplete){
        alert('請填寫基本資料所有欄位。');
        return;
    }else if (completionRate.value <  100) {  // 檢查完成度是否為 100%
        alert('您還有題目尚未完成，請檢查所有題目。');
    } else {
        // 讀取目前 localStorage 裡是否已經有舊資料
        const historyData = JSON.parse(localStorage.getItem('assessment_history') || '[]');

        // 建立一筆新紀錄物件
        const newRecord = {
            id: Date.now(), // 用時間戳記當作唯一 ID
            title: '孕婦產前健康照護衛教指導紀錄表',
            date: new Date().toLocaleDateString(), // 儲存當下日期
            timestamp: new Date().getTime(), // 排序用
            formData: JSON.parse(JSON.stringify(form)), // 深拷貝表單內容，避免參照問題
            eduData: JSON.parse(JSON.stringify(educationTopics)) // 衛教題目的勾選狀態也要存
        };

        // 加入陣列並存回 localStorage
        historyData.unshift(newRecord); // unshift 讓最新的排在最前面
        localStorage.setItem('assessment_history', JSON.stringify(historyData));

        console.log('Form Data Saved:', newRecord);

        // 顯示成功視窗
        showSuccessModal.value = true; 
    }
};

// 關閉彈窗函式
const closeModal = () => {
  // 如果是「成功視窗」被關閉
  if (showSuccessModal.value) {
    showSuccessModal.value = false;
    
    // 跳轉至歷史填寫紀錄頁面
    router.push('/self-assessment/history'); 
  } 
};
</script>

<style scoped>
/* Form Card */
.form-card {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-label {
  background-color: #f0f4f8;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-lr;
  letter-spacing: 3px;
  font-weight: bold;
  color: #4a5568;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
  padding: 10px 0;
}

.card-body {
  flex-grow: 1;
  padding: 20px;
}

/* Grid System for Inputs */
.row { display: flex; gap: 20px; margin-bottom: 15px; }
.col-6 { flex: 1; }
.col-12 { width: 100%; } /* 新增 Full Width 樣式 */

.form-group label { display: block; margin-bottom: 5px; color: #444; font-size: 14px; font-weight: bold; }
.form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;}

/* Questions */
.question-item { margin-bottom: 15px; border-bottom: 1px dashed #eee; padding-bottom: 10px; }
.question-item:last-child { border-bottom: none; }
.q-title { font-weight: bold; color: #444; margin-bottom: 8px; }

/* Radio Group */
.radio-group { display: flex; flex-wrap: wrap; gap: 15px; }
.radio-group label { display: flex; align-items: center; cursor: pointer; color: #555; }
.radio-group input { margin-right: 6px; }

/* 憂鬱檢測小題的區塊樣式 */
.sub-question-block {
    margin-bottom: 15px; /* 小題之間的間距 */
    padding-left: 5px;   /* 稍微縮排 */
}

/* 讓小題的文字與 Radio Group 分開一點 */
.sub-q-text {
    margin-bottom: 8px;
    color: #555;
    font-size: 15px;
}

/* 醫療史 */
.history-checklist { background-color: #f8fafc; padding: 15px; border-radius: 4px; margin-top: 10px; border: 1px solid #e2e8f0; }
.history-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.check-label { display: flex; align-items: flex-start; font-size: 14px; color: #555; cursor: pointer; }
.check-label input { margin-top: 3px; margin-right: 6px; }

/* 衛教指導區塊樣式調整 */
.edu-topic { 
    margin-bottom: 25px; 
}

.topic-title { 
    font-size: 16px; 
    color: #2c3e50; 
    border-left: 4px solid #3498db; 
    padding-left: 10px; 
    margin-bottom: 15px; 
}

/* 每一題的容器 */
.edu-item-row {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #eee; /* 虛線分隔每題 */
}

.edu-item-row:last-child {
    border-bottom: none;
}

/* 題目文字 */
.edu-text { 
    font-size: 15px; 
    color: #555; 
    line-height: 1.6; 
    margin-bottom: 10px; /* 文字與選項的間距 */
}

/* 清楚/不清楚 選項區 */
.edu-radio-group {
    display: flex;
    gap: 20px; /* 選項之間的間距 */
}

.radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #444;
}

.radio-label input {
    margin-right: 6px;
    width: 16px;
    height: 16px;
    accent-color: #3498db; /* 選中時的藍色 */
}

.mb-4 {
  margin-bottom: 20px;
}

.opt-id {
  font-weight: bold;
  color: #3498db;
  margin-right: 4px;
}

/* 嚴重合併症區塊樣式 */
.complication-section {
  background-color: #fff4f4; 
  border: 1px solid #f5c6cb;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
}

.complication-title {
  font-weight: bold;
  color: #c0392b;
  margin-bottom: 10px;
  font-size: 14px;
}

/* 簡單的滑動淡入動畫 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}


/* 勾選其他的行內輸入框樣式 */
.inline-input {
    border: none;
    border-bottom: 1px solid #999; /* 只有底線 */
    background: transparent;
    margin-left: 8px;
    padding: 2px 5px;
    font-size: 14px;
    width: 120px; /* 控制寬度 */
    outline: none;
    transition: border-color 0.3s;
}

.inline-input:focus {
    border-bottom-color: #3498db; /* 聚焦時變色 */
}

/* 讓 Label 能夠包容輸入框而不換行，或視情況換行 */
.check-label {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
    cursor: pointer;
    line-height: 1.4;
    flex-wrap: wrap; /* 允許輸入框換行，避免手機版跑版 */
}

/* --- 彈窗內容樣式 --- */
/* 全螢幕遮罩 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4); /* 半透明黑底 */
    display: flex;
    justify-content: center; /* 水平置中 */
    align-items: center;     /* 垂直置中 */
    z-index: 9999;           /* 確保在最上層 */
    /* 背景模糊效果 */
    /* backdrop-filter: blur(2px);  */
}

/* 白色視窗本體 */
.modal-box {
    background-color: white;
    width: 320px;
    padding: 40px 30px;
    border-radius: 4px;
    position: relative;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    text-align: center;
    animation: popIn 0.3s ease-out;
}

/* 關閉按鈕 */
.modal-close {
    position: absolute;
    top: 0;
    right: 0;
    background: #dbe2e8;
    border: none;
    font-size: 24px;
    color: #666;
    width: 36px;
    height: 36px;
    cursor: pointer;
    line-height: 36px;
    transition: 0.2s;
}
.modal-close:hover {
    background: #cbd5e0;
}

/* 彈出動畫 */
@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
/* 控制圖片大小 */
.modal-icon {
    width: 80px;  
    height: auto; /* 維持比例 */
    margin-bottom: 15px;
    object-fit: contain;
}

.modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.modal-title {
    font-size: 22px;
    font-weight: bold;
    margin: 0;
    letter-spacing: 1px;
}

/* --- 平板 (iPad Air, 1024px 以下) --- */
@media (max-width: 1024px) {
  .card-body {
    padding: 20px; /* 稍微縮小內距 */
  }
}

/* --- 手機版 (iPhone 12/14 Pro Max, 768px 以下) --- */
@media (max-width: 768px) {
  /* 1. 卡片佈局重組：左標題變上標題 */
  .form-card {
    flex-direction: column; /* 改為垂直排列 */
  }

  .card-label {
    width: 100%;       /* 寬度滿版 */
    height: auto;      /* 高度自動 */
    writing-mode: horizontal-tb; /* 文字改為橫書 */
    flex-direction: row; /* 內容橫向排列 */
    justify-content: flex-start; /* 靠左對齊 */
    padding: 12px 20px;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    letter-spacing: 1px;
    font-size: 16px;
  }

  /* 2. 輸入框 Grid 堆疊 */
  .row {
    flex-direction: column; /* 雙欄變單欄 */
    gap: 15px;
  }
  
  .col-6 {
    width: 100%; /* 確保滿版 */
  }
  
  /* 增加輸入框高度，方便手指點擊 */
  .form-group input {
    padding: 12px; 
  }

  /* 3. 醫療史與 Checkbox */
  .history-grid {
    grid-template-columns: 1fr; /* 改為單欄，避免 Checkbox 文字擠壓 */
    gap: 12px;
  }
  
  /* 讓「其他」輸入框在手機上換行顯示，避免寬度不足 */
  .check-label {
    flex-wrap: wrap; 
  }
  .inline-input {
    width: 100%; /* 輸入框滿版 */
    margin-left: 0;
    margin-top: 5px;
    border-bottom: 1px dashed #94a3b8;
  }

  /* 4. Radio Button 優化 */
  .radio-group {
    gap: 15px;
  }
  .radio-group label {
    width: 100%; /* 選項佔滿一行，避免誤觸 */
    padding: 5px 0;
  }

  /* 5. 衛教指導 */
  .edu-item-row {
    padding-bottom: 20px;
  }
  .edu-radio-group {
    justify-content: flex-start;
    gap: 40px; /* 拉大「清楚/不清楚」的間距 */
  }
  
  /* 彈窗微調 */
  .modal-box {
    width: 85%; /* 手機上不設固定寬度，改百分比 */
    padding: 30px 20px;
  }
}
</style>