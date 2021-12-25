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

export interface Pos {
  x: number
  y: number
  w: number
  h: number
  i: string
}

export interface Kv {
  key: string
  label: string
}

export interface TableConfig {
  type: string
  sql: string
  name: string
  pos: Pos
  kv: Kv[]
}
export interface yOption{
  smooth : boolean
}
export interface ChartConfig extends TableConfig{
  x: string
  xAxisType: string
  y: string[]
  datatype: string[] // such as line/bar ...
  yDataType: string
  yExtraOption: yOption[]
  name: string
}

export interface ReportConfig {
  id: number
  workspace_id: number
  name: string
  type: string
  owner: number
  config: {
    charts: (TableConfig|ChartConfig)[]
  }
}

export interface ReportData {
  chart: TableConfig | ChartConfig
  data: object[]
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
  },
  report: {
    getAll (pagination: Pagination, workspaceID: number) {
      return axios.post('/report/get_all', { ...pagination, workspace_id: workspaceID })
    },
    get (id: number) {
      return axios.post('/report/get', { id })
    },
    execute (id: number) {
      return axios.post('/report/execute', { id })
    },
    update (config: ReportConfig) {
      return axios.post('/report/update', config)
    }
  }
}

export default api
