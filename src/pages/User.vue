<template>
  <div>
    <h1>欢迎您 {{ user.nickname }}, 编号{{ user.id }}</h1>
    <h1>您共有 {{ workspaceCount }}个工作区，共计{{ count }}个报表</h1>
    <template
      v-for="(item,index) in info.workspaceInfo"
      :key="item.workspaceName"
    >
      <h3 class="left">
        工作区{{ index }} <b>{{ item.workspaceName }}</b>
      </h3>
      <h5
        v-for="(item2,index2) in item.reportName"
        :key="item2"
        class="left"
      >
        &nbsp;&nbsp;&nbsp;-&nbsp;{{ index2 }}.{{ item2 }}
      </h5>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import type { User } from '../utils/user'
import api from '../api'
import type { UserStatistics } from '../api'
const user : Ref<User> = ref({} as User)
const count = ref(0)
const workspaceCount = ref(0)
const info : Ref<UserStatistics> = ref({} as UserStatistics)
onMounted(() => {
  const json = localStorage.getItem('user')
  user.value = JSON.parse(json!) as User
  getData()
})

const getData = async () => {
  try {
    const resp = (await api.getStatistics({ id: user.value.id })).data
    info.value = (resp.data) as UserStatistics
    info.value.workspaceInfo.forEach(item => {
      count.value = count.value + item.reportName.length
    })
    workspaceCount.value = info.value.workspaceInfo.length
    console.log(info.value)
  } catch (error) {
    console.error(error)
  }
}
</script>
<style scoped>
  .left{
    text-align: left;
  }
</style>
