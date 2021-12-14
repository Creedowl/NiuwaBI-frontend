/* eslint-disable camelcase */
import axios from '../utils/axios'

export interface Pagination {
  page_size: number,
  page_num: number
}

export interface WorkspaceConfig {
  id: number
  name: string
  owner: number
  config: {
    db: {
      type: string,
      host: string,
      port: number,
      username: string,
      password: string,
      database: string
    }
  }
}

const api = {
  ping (name: string) {
    return axios.get('/ping', { params: { name } })
  },
  login (userinfo: {username: string, password: string}) {
    return axios.post('/login', userinfo)
  },
  workspace: {
    getAll (pagination: Pagination) {
      return axios.post('/workspace/get_all', pagination)
    },
    testConn (config: WorkspaceConfig) {
      return axios.post('/workspace/test_conn', config.config.db)
    },
    create (config: WorkspaceConfig) {
      return axios.post('/workspace/create', config)
    },
    update (config: WorkspaceConfig) {
      return axios.post('/workspace/update', config)
    },
    delete (id: number) {
      return axios.post('/workspace/remove', { id })
    }
  }
}

export default api
