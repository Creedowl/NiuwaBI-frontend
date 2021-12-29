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

export interface Filter {
  field: string
  op: string
  value: any
}

export interface BaseConfig {
  type: string
  chart_type: string
  sql: string
  name: string
  pos: Pos
  kv: Kv[]
  fields: string[]
  filters: Filter[]
}

export class TableConfig implements BaseConfig {
  type: string
  chart_type: string
  sql: string
  name: string
  pos: Pos
  kv: Kv[]
  fields: string[]
  filters: Filter[]

  constructor (x: number, y: number) {
    this.type = 'table'
    this.chart_type = 'sql'
    this.sql = ''
    this.name = ''
    this.pos = {
      x: x,
      y: y,
      w: 10,
      h: 10,
      i: Math.random().toString(36).substring(2)
    }
    this.kv = []
    this.fields = []
    this.filters = []
  }
}

export interface yOption {
  smooth: boolean
}

export interface ChartConfig extends BaseConfig {
  x: string
  xAxisType: string
  y: string[]
  datatype: string[] // such as line/bar ...
  yDataType: string
  yExtraOption: yOption[]
  name: string
}

export interface dimension {
  type: string
  name: string
  field: string
  label: string
}

export interface equation_dimension {
  type: string
  name: string
  label: string
  formula: string
  elements: string[]
}

export interface metric {
  type: string
  name: string
  field: string
  aggr: string
  label: string
}

export interface equation_metric {
  type: string
  name: string
  label: string
  formula: string
  elements: string[]
}

export interface Dmf {
  table: string
  dimensions: (dimension | equation_dimension)[]
  metrics: (metric | equation_metric)[]
}

export interface ReportConfig {
  id: number
  workspace_id: number
  name: string
  owner: number
  config: {
    charts: (TableConfig | ChartConfig)[]
    dmf: Dmf
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
  login (userinfo: { username: string, password: string }) {
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
    create (config: ReportConfig) {
      return axios.post('/report/create', config)
    },
    update (config: ReportConfig) {
      return axios.post('/report/update', config)
    },
    delete (id: number) {
      return axios.post('/report/remove', { id })
    }
  }
}

export default api
