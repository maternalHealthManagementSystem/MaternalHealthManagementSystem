<template>
  <div class="card-section">
    <h1>{{ title }}</h1>
    <div class="desc" v-for="(segment, index) in desc" :key="index">
      <a 
          v-if="segment.link" 
          :href="segment.link" 
          target="_blank" 
          class="desc-link"
        >
          {{ segment.text }}
        </a>
        
        <span v-else>
          {{ segment.text }}
        </span>
    </div>
    <button class="more-btn" @click="$emit('click-more')">更多內容</button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  desc: { type: Array, required: true, default: () => [] }
})
defineEmits(['click-more'])
</script>

<style scoped>
.card-section {
  width: 65%;
  margin: 40px auto;
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: relative; 
  min-height: 150px;
}
h1 {
  color: #3b4a5a;
  margin-bottom: 10px;
}
.desc {
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 1.6; /* 增加行高，閱讀更舒適 */
  color: #6b6b6b;
}
/* 連結樣式 */
.desc-link {
  color: #3498db;
  text-decoration: underline; 
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
  margin: 0 2px; /* 連結與文字間稍微留白 */
}

.desc-link:hover {
  color: #1e6091;
}
.more-btn {
  position: absolute;
  bottom: 20px;
  right: 30px;
  border: none;
  background: #fff;
  padding: 10px 24px;
  font-size: 13px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  background-color: #57aee2;
  color: white;
}
</style>
