<template>
  <AssessmentPanel title="歷史填寫紀錄">
    
    <button class="btn-back" @click="$router.back()">← 返回列表</button>
      
    <div v-if="recordData" class="record-content-wrapper">
      
      <div class="record-summary">
        <h3 class="record-title">{{ recordData.title }}</h3>
        
        <div class="record-meta">
          <span>填寫日期：{{ recordData.date }}</span>
          
          <span v-if="recordData.type === 'depression'" class="score-badge">
            分數：{{ recordData.score }}
          </span>
        </div>

        <div v-if="recordData.type === 'depression'" class="advice-box">
          <p class="advice-text" :class="adviceClass">
            {{ scoreAdvice }}
          </p>
        </div>
      </div>

      <hr class="divider">

      <div v-if="recordData.type === 'prenatal'" class="form-readonly">
        <div class="section-block">
          <h4 class="section-title">基本資料</h4>
          <div class="info-grid">
            <div class="info-item"><label>姓名：</label> {{ recordData.name }}</div>
            <div class="info-item"><label>身分證字號：</label> {{ recordData.idNumber }}</div>
            <div class="info-item"><label>出生日期：</label> {{ recordData.birthDate }}</div>
            <div class="info-item"><label>聯絡地址：</label> {{ recordData.address }}</div>
            <div class="info-item"><label>手機號碼：</label> {{ recordData.phone }}</div>
            <div class="info-item"><label>住家電話：</label> {{ recordData.homePhone }}</div>
          </div>
        </div>
        <div class="section-block">
          <h4 class="section-title">健康行為</h4>
          <ul class="readonly-list">
            <li><label>吸菸習慣：</label> {{ optionMaps.smoking[recordData.behavior.smoking] }}</li>
            <li><label>二手菸環境：</label> {{ optionMaps.secondhandSmoke[recordData.behavior.secondhandSmoke] }}</li>
            <li><label>飲酒習慣：</label> {{ optionMaps.drinking[recordData.behavior.drinking] }}</li>
            <li><label>嚼檳榔：</label> {{ optionMaps.betelNut[recordData.behavior.betelNut] }}</li>
            <li><label>使用毒品：</label> {{ optionMaps.drugs[recordData.behavior.drugs] }}</li>
            <li>
              <label>憂鬱檢測：</label>
              <div class="sub-list">
                <p>1. 情緒低落：{{ optionMaps.depression[recordData.behavior.depression1] }}</p>
                <p>2. 失去興趣：{{ optionMaps.depression[recordData.behavior.depression2] }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="section-block">
          <h4 class="section-title">孕產婦醫療史</h4>
          <div class="history-result">
            <p class="history-main">是否有病史：
              <span :class="recordData.medicalHistory.hasHistory ? 'text-red' : 'text-green'">
                {{ recordData.medicalHistory.hasHistory ? '是' : '否' }}
              </span>
            </p>
            
            <div v-if="recordData.medicalHistory.hasHistory" class="selected-tags">
              <span v-for="item in recordData.medicalHistory.selectedItems" :key="item" class="tag">
                {{ medicalLabels[item] || '嚴重合併症' }}
                <span v-if="item === '11'"> ({{ recordData.medicalHistory.otherNote }})</span>
              </span>
            </div>
          </div>
        </div>
        <div class="section-block">
          <h4 class="section-title">衛教指導評估</h4>
          
          <div v-for="(topic, index) in recordData.educationResults" :key="index" class="edu-readonly-group">
            <p class="edu-title">{{ topic.title }}</p>
            
            <div class="edu-list">
              <div v-for="(point, pIndex) in topic.points" :key="pIndex" class="edu-detail-row">
                
                <div class="edu-question-text">
                  {{ pIndex + 1 }}. {{ point.text }}
                </div>
                
                <div class="edu-status-tag">
                  <span class="status-badge" :class="point.value === 1 ? 'bg-blue' : 'bg-gray'">
                    {{ optionMaps.education[point.value] }}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="recordData.type === 'depression'" class="form-readonly">
        <div class="info-row">
          <label>身分：</label>
          <span>{{ recordData.identity === '1' ? '準媽媽' : '寶寶媽媽' }}</span>
        </div>
        <div class="info-row">
          <label>預產期或寶寶生日：</label>
          <span>{{ recordData.dueDate }}</span>
        </div>
        <div class="question-list">
          <div v-for="(q, index) in recordData.answers" :key="index" class="q-item">
            <p class="q-text">{{ index + 1 }}. {{ q.question }}</p>
            <div class="answer-display">
              <span class="selected-option">● {{ q.answer }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    
    <div v-else class="loading">
      載入資料中...
    </div>

  </AssessmentPanel>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import AssessmentPanel from '@/components/AssessmentPanel.vue';
// 引入題目 JSON 檔案
import prenatalQuestions from '@/assets/data/prenatalQuestions.json';
import depressionQuestions from '@/assets/data/depressionQuestions.json';
const route = useRoute();
const recordData = ref(null);

// --- 定義選項對照表 (Mapping) ---
const optionMaps = {
  smoking: { 0: '否', 1: '偶爾或應酬才吸', 2: '平均一天約吸一包菸以下', 3: '平均一天約吸一包菸以上' },
  secondhandSmoke: { 0: '否', 1: '是', 2: '周遭環境沒有二手菸' },
  drinking: { 0: '否', 1: '偶爾或應酬才喝', 2: '經常喝' },
  betelNut: { 0: '否', 1: '偶爾或應酬才嚼', 2: '經常嚼' },
  drugs: { 0: '否', 1: '是' },
  depression: { 0: '否', 1: '是' },
  education: { 1: '清楚', 0: '不清楚'}
};

// 醫療病史的選項標籤 (用於將 ID 轉為文字)
const medicalLabels = {
  '1': '妊娠期高血壓疾病', '2': '前置胎盤', '3': '羊水過多或過少',
  '4': '胎兒生長限制', '5': '胎盤功能異常', '6': '胎兒體重過重',
  '7': '遺傳疾病', '9': '骨盆異常', '10': '子宮、產道異常',
  '11': '其他', '8-1': '心臟病', '8-2': '腎臟疾病',
  '8-3': '血液系統疾病', '8-4': '肝臟疾病', '8-5': '活動性肺結核',
  '8-6': '糖尿病', '8-7': '甲狀腺功能亢進症', '8-8': '精神病或神經系統疾病',
  '8-9': '妊娠合併免疫系統疾病', '8-10': '卵巢或子宮腫瘤',
  '8-11': '孕期感染性疾病', '8-12': '性傳染病'
};

// --- 前端模擬資料庫 (Mock Data) ---
const mockDatabase = [
  {
    id: '1', // 對應列表頁的 ID
    type: 'depression',
    title: '愛丁堡產後憂鬱量表',
    date: '2025 / 11 / 15',
    score: 14,
    identity: '1',
    dueDate: '2026 / 01 / 23',
    answers: [0, 1, 3, 2, 2, 1, 1, 2, 2, 0]
  },
  {
    id: '2',
    type: 'prenatal',
    title: '孕婦產前健康照護衛教指導紀錄表',
    date: '2025 / 11 / 10',
    name: '陳小美',
    idNumber: 'A223456789',
    birthDate: '1995-08-15',
    address: '台北市大安區信義路三段 150 號',
    phone: '0912-345-678',
    homePhone: '02-2700-1234',
    behavior: {
      smoking: 0,           // 0: 否
      secondhandSmoke: 2,   // 2: 周遭環境沒有二手菸
      drinking: 1,          // 1: 偶爾或應酬才喝
      betelNut: 0,          // 0: 否
      drugs: 0,             // 0: 否
      depression1: 0,       // 0: 否 (情緒低落)
      depression2: 1        // 1: 是 (失去興趣)
    },
    medicalHistory: {
      hasHistory: true,     // 是，有病史
      // 這裡模擬勾選了：妊娠高血壓(1)、糖尿病(8-6)、其他(11)
      selectedItems: ['1', '8-6', '11'], 
      otherNote: '輕微貧血症狀' // 當勾選 11 時的輸入內容
    },
    medicalHistory: {
      hasHistory: true,     // 是，有病史
      // 這裡模擬勾選了：妊娠高血壓(1)、糖尿病(8-6)、其他(11)
      selectedItems: ['1', '8-6', '11'], 
      otherNote: '輕微貧血症狀' // 當勾選 11 時的輸入內容
    },
    educationResults: [
      { points: [1, 1] },       // 第1大題的答案
      { points: [1, 1, 1, 0] }, // 第2大題的答案
      { points: [1, 1] },
      { points: [1, 1, 0, 1] },
      { points: [1, 1, 1] },
      { points: [1, 1, 1] }
    ]
  }
  // ID 3, 4, 5 的假資料...
];

// 模擬 API 請求
const fetchRecordDetail = (id) => {
  console.log(`正在搜尋 ID: ${id} 的資料...`);

  setTimeout(() => {
    const foundData = mockDatabase.find(item => item.id == id);
    
    if (foundData) {
      // 深拷貝一份資料，避免汙染原始 Mock Data
      const mergedData = JSON.parse(JSON.stringify(foundData));

      // --- 合併邏輯 A: 愛丁堡量表 ---
      if (mergedData.type === 'depression') {
        // 將 JSON 題目與使用者的 answer 結合
        mergedData.answers = depressionQuestions.map((q, index) => {
          const userVal = foundData.answers[index];
          // 找出使用者選的那個選項文字
          const selectedOpt = q.options.find(opt => opt.value === userVal);
          
          return {
            question: q.text,
            answer: selectedOpt ? selectedOpt.text : '未填答'
          };
        });
      }
      
      // --- 合併邏輯 B: 產前紀錄表 ---
      else if (mergedData.type === 'prenatal') {
        // 合併衛教指導題目
        mergedData.educationResults = prenatalQuestions.educationTopics.map((topic, i) => {
          return {
            title: topic.title,
            points: topic.points.map((pt, j) => {
              const userVal = foundData.educationResults[i]?.points[j];
              return {
                text: pt.text, // 從 JSON 拿題目
                value: userVal // 從 Mock Data 拿答案
              };
            })
          };
        });
      }

      recordData.value = mergedData;
    } else {
      alert('查無此紀錄');
    }
  }, 0);
};

// 根據分數計算建議 (愛丁堡專用)
const scoreAdvice = computed(() => {
  if (!recordData.value || recordData.value.type !== 'depression') return '';
  const score = recordData.value.score;
  if (score >= 13) return '分數偏高，建議尋求專科醫師協助。';
  if (score >= 10) return '情緒需注意，建議近期再次評估。';
  return '情緒狀態穩定。';
});

const adviceClass = computed(() => {
  if (!recordData.value) return '';
  const score = recordData.value.score;
  if (score >= 13) return 'text-danger';
  if (score >= 10) return 'text-warning';
  return 'text-success';
});

onMounted(() => {
  // 從網址參數 (route.params) 拿到 ID，並發動搜尋
  fetchRecordDetail(route.params.id);
});
</script>

<style scoped>
/* 返回按鈕 */
.btn-back {
  background: none;
  border: none;
  color: #5a6b7c;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
}
.btn-back:hover { text-decoration: underline; }

/* 標題與摘要 */
.record-summary { padding: 0 10px; margin-bottom: 20px; }
.record-title { color: #444; margin-bottom: 5px; }
.record-meta { color: #666; font-size: 14px; }
.score-badge { 
  background-color: #7f9ab0; color: white; 
  padding: 2px 8px; border-radius: 4px; margin-left: 10px; 
}

/* 分隔線 */
.divider { border: 0; border-top: 1px dashed #ccc; margin: 20px 0; }

/* 建議文字區塊 */
.advice-box {
  margin-top: 10px; padding: 10px;
  background-color: #f9f9f9; border-left: 4px solid #ccc;
}
.text-danger { color: #c0392b; border-left-color: #c0392b; }
.text-warning { color: #d35400; border-left-color: #d35400; }
.text-success { color: #27ae60; border-left-color: #27ae60; }

/* 表單樣式 */
.section-block {
  background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;
}
.section-title {
  border-left: 4px solid #5a6b7c; padding-left: 8px; margin-bottom: 10px; color: #333;
}
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.info-item label { font-weight: bold; color: #555; }
.info-row { margin-bottom: 15px; font-size: 16px; color: #444;}

.q-item { 
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.5); /* 半透明白底 */
  padding: 10px;
  border-radius: 4px; 
}
.selected-option { color: #3498db; font-weight: bold; }

/* 衛教指導區塊 */
.edu-readonly-group {
  margin-bottom: 25px;
}

.edu-title {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 16px;
  background-color: #f0f4f8; /* 標題加個淡底色區隔 */
  padding: 8px;
  border-radius: 4px;
}

.edu-detail-row {
  display: flex; /* 左右排列 */
  justify-content: space-between;
  align-items: flex-start; /* 文字靠上對齊 */
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.edu-detail-row:last-child {
  border-bottom: none;
}

/* 題目文字樣式 */
.edu-question-text {
  flex: 1; /* 佔滿剩餘空間 */
  font-size: 15px;
  color: #555;
  line-height: 1.5;
  padding-right: 15px; /* 與標籤的間距 */
}

/* 狀態標籤容器 */
.edu-status-tag {
  flex-shrink: 0; /* 防止標籤被壓縮 */
}

/* 標籤樣式 */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  color: white;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.bg-blue { background-color: #3498db; }
.bg-gray { background-color: #e85d44; }
</style>
