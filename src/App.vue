<!-- <script setup>
  import { RouterView } from 'vue-router';
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped>
  .container{
    min-width: 1000px;
    margin: 0 auto;
  }
</style> -->

<template>
  <div>
    <HeaderBar />
    <router-view />
  </div>
</template>

<script setup>
import HeaderBar from './components/HeaderBar.vue';
</script>



<!-- <template>
  <div id="app">
    <HealthEduInfo />
  </div>
</template>

<script setup>
import HealthEduInfo from './components/HealthEduInfo.vue';
</script> -->

<!-- <style>
#app {
  font-family: 'Microsoft JhengHei', 'PingFang TC', 'Noto Sans TC', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 全局樣式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style> -->


<!-- <template>
<div class="app">
<header class="header">
<h1 class="logo">孕產婦健康管理系統</h1>


<nav class="nav">
<RouterLink to="/" :class="navActive('/')">首頁</RouterLink>
<RouterLink to="/preg-edu" :class="navActive('/preg-edu')">孕期衛教資訊</RouterLink>
<RouterLink to="/checkup-edu" :class="navActive('/checkup-edu')">產檢衛教資訊</RouterLink>
<input type="text" class="search" placeholder="輸入關鍵字" />
</nav>


<div class="icons">
<div class="notify">
<img src="@/assets/notify.png" alt="bell" />
<span class="badge">1</span>
</div>
<img src="@/assets/user.png" class="user"/>
</div>
</header>


<main class="main">
<RouterView />
</main>
</div>
</template>


<script setup>
import { useRoute } from 'vue-router'


const route = useRoute()


const navActive = (path) => {
return route.path === path ? 'active' : ''
}
</script>


<style scoped>
/* RWD header */
.header {
display: flex;
flex-wrap: wrap;
align-items: center;
justify-content: space-between;
padding: 15px 25px;
background: #eef2f7;
}


.nav {
display: flex;
flex-wrap: wrap;
gap: 15px;
align-items: center;
}


.nav a {
text-decoration: none;
color: #555;
}
.nav a.active {
color: #2e75e0;
border-bottom: 2px solid #2e75e0;
font-weight: bold;
}


@media (max-width: 768px) {
.nav { width: 100%; margin-top: 10px; }
.search { width: 100%; }
}


.main {
padding: 20px 40px;
}
</style> -->







