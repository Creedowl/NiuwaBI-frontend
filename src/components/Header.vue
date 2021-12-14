<template>
  <el-menu
    mode="horizontal"
    :ellipsis="false"
    theme="dark"
    class="header_menu"
    :router="true"
    :default-active="current"
  >
    <div
      id="title"
      @click="logout(router)"
    >
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
      <el-menu-item index="/workspace">
        <el-icon>
          <list />
        </el-icon>
        <span>工作区</span>
      </el-menu-item>
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
import { HomeFilled, UserFilled, Stamp, List } from '@element-plus/icons'
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { logout, Auth } from '../utils/user'

const auth = inject<Auth>('auth') as Auth

const authenticated = computed(() => {
  return auth.user !== null
})

const router = useRouter()

const current = computed(() => router.currentRoute.value.path)

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
