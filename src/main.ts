import { createApp } from 'vue'
import VueAxios from 'vue-axios'
// @ts-ignore
import * as VueGridLayout from 'vue-grid-layout'
import * as echarts from 'echarts'
import api from './api'
import App from './App.vue'
import router from './router'
import axios from './utils/axios'
import { initAuth } from './utils/user'

// 这些 css 得手动导入。。。
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/message/style/css'

const app = createApp(App)

app.config.globalProperties.$Path = {
  workspace: {
    id: 0,
    name: ''
  },
  report: {
    id: 0,
    name: ''
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $Path: any
  }
}

app.use(router)
app.use(VueAxios, axios)
app.use(VueGridLayout)
app.use(initAuth())
app.provide('axios', app.config.globalProperties.axios)
app.provide('$api', api)
app.config.globalProperties.echarts = echarts
app.mount('#app')
