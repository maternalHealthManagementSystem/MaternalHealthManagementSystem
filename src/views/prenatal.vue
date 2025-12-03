<template>
  <div class="dashboard-container" :class="{ expanded: activeRecord }">
    <!-- 左側列表（會從中間 → 左側移動） -->
    <div class="checkup-list-panel" :class="{ centered: !activeRecord }">
      <div
        v-for="(item, index) in checkupRecords"
        :key="index"
        :class="['checkup-item', { 'is-active': activeIndex === index }]"
        @click="selectRecord(index)"
      >
        <span class="indicator-icon">
          <template v-if="activeIndex === index">▼</template>
          <template v-else>▶</template>
        </span>
        <span class="item-text"
          >{{ item.date }} 第{{ item.checkupNumber }}次產檢</span
        >
      </div>
    </div>

    <!-- 右側內容（動畫淡入滑入） -->
    <transition name="slide-fade">
      <div v-if="activeRecord" class="report-area">
        <div class="report-card">
          <div class="report-header">
            <h3 class="report-title">
              {{ activeRecord.date }} 第{{ activeRecord.checkupNumber }}次產檢
            </h3>
            <button class="close-btn" @click="clearSelection">×</button>
          </div>

          <div class="report-table-container">
            <table>
              <thead>
                <tr>
                  <th v-for="header in tableHeaders" :key="header">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="key in filteredFields" :key="key">
                  <td>{{ fieldLabels[key] }}</td>
                  <td>{{ activeRecord.details[key] }}</td>
                  <td>{{ fieldDetails[key]?.unit || "--" }}</td>
                  <td>{{ fieldDetails[key]?.reference || "--" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

/* -----------------------------
   欄位名稱中 → 中文對照表
----------------------------- */
const fieldLabels = {
  gestational_age_wks: "妊娠週數（週）",
  gestational_age_days: "妊娠天數（日）",
  gravida: "懷孕次數 G",
  para: "生產次數 P",
  SA: "自然流產 SA",
  AA: "人工流產 AA",
  LMP: "末次月經 LMP",
  PMP: "前次月經 PMP",
  married_status: "婚姻狀態",
  body_weight: "體重（kg）",
  blood_pressure_sys: "收縮壓（mmHg）",
  blood_pressure_dia: "舒張壓（mmHg）",
  body_height: "身高（cm）",
  BMI: "BMI",
  pre_pregnancy_weight: "孕前體重（kg）",
  pre_pregnancy_bmi: "孕前 BMI",
  urine_sugar: "尿糖",
  urine_protein: "尿蛋白",
  Insemination: "授精方式",
  cohabitants_smoke: "同住家人是否吸菸",
  cohabitants_smoke_relationship: "與同住吸菸者關係",
};

/* -----------------------------
   欄位單位與參考值對照表
----------------------------- */
const fieldDetails = {
  gestational_age_wks: { unit: "週", reference: "-" },
  gestational_age_days: { unit: "日", reference: "-" },
  gravida: { unit: "次", reference: "-" },
  para: { unit: "次", reference: "-" },
  SA: { unit: "次", reference: "-" },
  AA: { unit: "次", reference: "-" },
  LMP: { unit: "日期", reference: "-" },
  PMP: { unit: "日期", reference: "-" },
  married_status: { unit: "", reference: "1.Married\n2.Widowed\n3.Divorced\n4.Single\n5.Unknow" },
  body_weight: { unit: "kg", reference: "孕期體重建議增加10~14公斤\n(來源：衛生福利部)" },
  blood_pressure_sys: { unit: "mmHg", reference: "<140" },
  blood_pressure_dia: { unit: "mmHg", reference: "<90" },
  body_height: { unit: "cm", reference: "-" },
  BMI: { unit: "", reference: "18.5~24.9" },
  pre_pregnancy_weight: { unit: "kg", reference: "-" },
  pre_pregnancy_bmi: { unit: "", reference: "18.5~24.9" },
  urine_sugar: { unit: "", reference: "0~5\n（0.Neg, 1+, 2+, 3+, 4+, 5.Trace）" },
  urine_protein: { unit: "", reference: "0~5\n（0.Neg, 1+, 2+, 3+, 4+, 5.Trace）" },
  Insemination: { unit: "", reference: "試管嬰兒(IVF)/人工授精(AIH)" },
  cohabitants_smoke: { unit: "", reference: "Y/N" },
  cohabitants_smoke_relationship: { unit: "", reference: "" },
};

/* -----------------------------
   模擬資料 mockData（含所有欄位）
----------------------------- */
const mockData = [
  {
    date: "2025/10/15",
    checkupNumber: 1,
    details: {
      gestational_age_wks: 12,
      gestational_age_days: 3,
      gravida: 1,
      para: 0,
      SA: 0,
      AA: 0,
      LMP: "2024/07/29",
      PMP: "2024/07/01",
      married_status: "1",
      body_weight: "50",
      blood_pressure_sys: "110",
      blood_pressure_dia: "70",
      body_height: "160",
      BMI: "19.5",
      pre_pregnancy_weight: "48",
      pre_pregnancy_bmi: "18.8",
      urine_sugar: "0",
      urine_protein: "0",
      Insemination: "自然受孕",
      cohabitants_smoke: "N",
      cohabitants_smoke_relationship: "",
    },
  },

  {
    date: "2025/11/12",
    checkupNumber: 2,
    details: {
      gestational_age_wks: 16,
      gestational_age_days: 1,
      gravida: 1,
      para: 0,
      SA: 0,
      AA: 0,
      LMP: "2024/07/29",
      PMP: "2024/07/01",
      married_status: "1",
      body_weight: "52",
      blood_pressure_sys: "112",
      blood_pressure_dia: "72",
      body_height: "160",
      BMI: "20.3",
      pre_pregnancy_weight: "48",
      pre_pregnancy_bmi: "18.8",
      urine_sugar: "0",
      urine_protein: "0",
      Insemination: "自然受孕",
      cohabitants_smoke: "N",
      cohabitants_smoke_relationship: "",
    },
  },
  {
    date: "2025/12/16",
    checkupNumber: 3,
    details: {
      gestational_age_wks: 20,
      gestational_age_days: 1,
      gravida: 1,
      para: 0,
      SA: 0,
      AA: 0,
      LMP: "2024/07/29",
      PMP: "2024/07/01",
      married_status: "1",
      body_weight: "53",
      blood_pressure_sys: "108",
      blood_pressure_dia: "65",
      body_height: "160",
      BMI: "20.3",
      pre_pregnancy_weight: "48",
      pre_pregnancy_bmi: "18.8",
      urine_sugar: "1+",
      urine_protein: "0",
      Insemination: "自然受孕",
      cohabitants_smoke: "N",
      cohabitants_smoke_relationship: "",
    },
  },
];

const filteredFields = computed(() => {
  if (!activeRecord.value) return [];
  return Object.keys(fieldLabels).filter(
    (key) => activeRecord.value.details[key] !== undefined
  );
});

/* -----------------------------
   Vue 狀態管理
----------------------------- */

const checkupRecords = ref(mockData);
const tableHeaders = ref(["檢驗項目名稱", "檢驗結果", "單位", "參考值"]);
const activeIndex = ref(null);

const activeRecord = computed(() => {
  if (activeIndex.value !== null) {
    return checkupRecords.value[activeIndex.value];
  }
  return null;
});

const selectRecord = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const clearSelection = () => {
  activeIndex.value = null;
};
</script>

<style scoped>
/* ------------------------------ */
/*  整體容器：展開與否影響 layout  */
/* ------------------------------ */
.dashboard-container {
  display: flex;
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin: 40px auto;
  transition: all 0.35s ease;
  min-height: 500px;
}

/* 當 activeRecord 不存在 → 左側面板在畫面中間 */
.checkup-list-panel.centered {
  margin: 0 auto;
}

/* 當 activeRecord 存在 → 左側靠左，右側出現 */
.dashboard-container.expanded {
  justify-content: flex-start;
}

/* ------------------------------ */
/*       左側列表面板樣式         */
/* ------------------------------ */
.checkup-list-panel {
  width: 260px;
  height: fit-content;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 15px 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.35s ease;
}

.checkup-item {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  cursor: pointer;
  transition: 0.2s;
  border-left: 4px solid transparent;
}

.checkup-item:hover {
  background-color: #f2f9ff;
}

.checkup-item.is-active {
  background-color: #e6f4ff;
  color: #1677ff;
  font-weight: bold;
  border-left: 4px solid #1677ff;
}

.indicator-icon {
  margin-right: 10px;
}

.item-text {
  text-decoration: underline;
}

/* ------------------------------ */
/*         右側動畫區域           */
/* ------------------------------ */
.report-area {
  flex: 1;
  padding-left: 25px;
}

/* 卡片樣式 */
.report-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 25px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

/* 標題列 */
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  color: #777;
}

/* ------------------------------ */
/*         右側動畫效果           */
/* ------------------------------ */
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-enter-active {
  transition: all 0.4s ease;
}

.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

/* 表格卡片內 */
.report-table-container {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}

th {
  background: #f4f6f9;
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}

td {
  padding: 10px;
  border: 1px solid #f2f2f2;
}

/* RWD */

/* 手機：左側列表全寬，右側改為滑入式抽屜 */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    margin: 10px auto;
    padding: 0 10px;
  }

  .checkup-list-panel {
    width: 100%;
    margin-bottom: 15px;
  }

  /* 右側報告改為覆蓋式 */
  .report-area {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    background: #ffffff;
    padding: 0;
    z-index: 999;
    overflow-y: auto;

    /* 從右邊滑入 */
    transform: translateX(100%);
    transition: transform 0.35s ease;
  }

  /* 有 activeRecord 時滑進來 */
  .dashboard-container.expanded .report-area {
    transform: translateX(0);
  }

  .report-card {
    border-radius: 0;
    height: auto;
    min-height: 100vh;
    padding: 18px;
  }

  /* 關閉按鈕放大 */
  .close-btn {
    font-size: 2rem;
    padding: 4px 10px;
  }

  /* 📌 表格可以左右滑 */
  .report-table-container {
    overflow-x: auto;
  }

  table {
    min-width: 500px;
  }
}

/* 平板：微調左右欄位比例 */
@media (min-width: 768px) and (max-width: 1024px) {
  .checkup-list-panel {
    width: 200px;
  }
}

/* 大螢幕：保持原本 layout */
@media (min-width: 1025px) {
  .dashboard-container {
    flex-direction: row;
  }
}
</style>
