<template>
  <el-menu
    mode="horizontal"
    :ellipsis="false"
    theme="dark"
    class="header_menu"
    :router="true"
    default-active="/"
  >
    <div id="title">
      <span>NiuWaBI</span>
    </div>
    <el-menu-item index="/">
      <el-icon>
        <home-filled />
      </el-icon>
      <span>首页</span>
    </el-menu-item>
    <template v-if="!authenticated">
      <el-menu-item index="/login">
        <el-icon>
          <user-filled />
        </el-icon>
        <span>登录</span>
      </el-menu-item>
      <el-menu-item index="/register">
        <el-icon>
          <stamp />
        </el-icon>
        <span>注册</span>
      </el-menu-item>
    </template>
    <template v-else>
      <el-menu-item index="/user">
        <el-icon>
          <user-filled />
        </el-icon>
        <span>用户中心</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { HomeFilled, UserFilled, Stamp } from '@element-plus/icons'
import { computed } from 'vue'
import { isAuthenticated } from '../utils/user'

const authenticated = computed(() => isAuthenticated())
</script>

<style scoped>
.header_menu {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* margin: 0 10%;
  z-index: auto; */
}

#title {
  font-weight: bold;
  font-size: large;
}
</style>
