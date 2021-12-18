import axios from 'axios'
import { getToken, logout } from './user'
import { ElMessage } from 'element-plus'
import router from '../router'

const instance = axios.create()

instance.defaults.baseURL = '/api'
instance.defaults.headers.post['Content-Type'] = 'application/json'

instance.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(res => {
  if (res.data.code !== 200) {
    if (res.data.message) {
      ElMessage({
        message: res.data?.message,
        type: 'error'
      })
    }
    return Promise.reject(res.data)
  }
  return res
}, err => {
  if (err.response.status === 401) {
    ElMessage({
      message: '登录过期，请重新登录',
      type: 'error'
    })
    logout(router)
  } else {
    ElMessage({
      message: err.response.data.message,
      type: 'error'
    })
  }
  return Promise.reject(err)
})

export default instance
