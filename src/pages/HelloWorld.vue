<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('2333')

// defineProps<{ msg: string }>()
const initial = false
const count = ref(0)
const features = [
  '万能数据库配置',
  '工作区管理',
  '自定义查询',
  '报表生成',
  '报表导出',
  '图表生成',
  'DMF支持'
]
const workflows = [
  '创建账号',
  '新建工作区，配置数据库连接，测试数据库能否联通',
  '新建报表，输入查询的语句以及',
  '管理报表，导出需要的数据'
]
const usages = [
  '报表',
  '图表(line、bar)'
]
const desc = [
  '类似Excel，配置想要查询的字段，可以是数据库字段也可以是SQL中的表达式，支持导出，适合以条为单位的数据',
  '图表，配置字段以及对应的类型自动生成对应的图表，适合时序数据、类别数据(树状图)，也支持多种图表类型混合使用'
]
</script>

<template>
  <div v-if="initial">
    <h1>{{ msg }}</h1>

    <p>
      Recommended IDE setup:
      <a
        href="https://code.visualstudio.com/"
        target="_blank"
      >VSCode</a>
      +
      <a
        href="https://github.com/johnsoncodehk/volar"
        target="_blank"
      >Volar</a>
    </p>

    <p>See <code>README.md</code> for more information.</p>

    <p>
      <a
        href="https://vitejs.dev/guide/features.html"
        target="_blank"
      >
        Vite Docs
      </a>
      |
      <a
        href="https://v3.vuejs.org/"
        target="_blank"
      >Vue 3 Docs</a>
    </p>

    <el-button type="primary">
      count is: {{ count }}
    </el-button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test hot module replacement.
    </p>
  </div>
  <div
    v-else
  >
    <h1> 牛蛙BI</h1>
    <p class="left">
      欢迎使用，牛蛙BI，使用本工具来一键生成报表、图表。
    </p>
    <h2 class="left">
      功能
    </h2>
    <ul class="left">
      <li
        v-for="feature in features"
        :key="feature"
      >
        {{ feature }}
      </li>
    </ul>
    <h2 class="left">
      工作流
    </h2>
    <ol class="left">
      <li
        v-for="workflow in workflows"
        :key="workflow"
      >
        {{ workflow }}
      </li>
    </ol>
    <h2 class="left">
      使用建议
    </h2>
    <div
      v-for="(title,index) in usages"
      :key="index"
      class="left"
    >
      <h3>{{ title }}</h3>
      <p>&nbsp;&nbsp;{{ desc[index] }}</p>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.left{
  text-align: left;
}
</style>
