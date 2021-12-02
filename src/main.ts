import { createApp } from 'vue'
import VueAxios from 'vue-axios'
import api from './api'

import App from './App.vue'
import router from './router'
import axios from './utils/axios'

// 这个 css 得手动导入。。。
import 'element-plus/es/components/message/style/css'

const app = createApp(App)

app.use(router)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.provide('$api', api)

app.mount('#app')
