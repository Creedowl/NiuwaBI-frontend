<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />-->
  <el-container>
    <el-header>
      <Header />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
import { onBeforeMount } from 'vue'
// import { login } from './utils/user'
import Header from './components/Header.vue'

onBeforeMount(async () => {
  // const resp = await login('root', 'admin')
  // console.log(resp)
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.el-footer {
  height: 10vh;
}

.el-main {
  display: flex;
  justify-content: center;
  padding-top: 2vh;
  padding-bottom: 2vh;
  min-height: 78vh;
}
</style>
