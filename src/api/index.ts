import axios from '../utils/axios'

const api = {
  ping (name: string) {
    return axios.get('/ping', { params: { name } })
  },
  login (userinfo: {username: string, password: string}) {
    return axios.post('/login', userinfo)
  }
}

export default api
