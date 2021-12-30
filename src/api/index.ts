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
    this.name = '普通报表'
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

export interface WorkspaceInfo{
  workspaceName: string
  reportName: string[]
}
export interface UserStatistics{
  workspaceInfo: WorkspaceInfo[]
}
export class ChartConfig extends TableConfig {
  x: string
  xAxisType: string
  y: string[]
  datatype: string[] // such as line/bar ...
  yDataType: string
  yExtraOption: yOption[]
  name: string
  trigger: string
  constructor (x :number, y:number) {
    super(x, y)
    this.type = 'line'
    this.datatype = []
    this.x = ''
    this.y = []
    this.xAxisType = 'category'
    this.yDataType = 'value'
    this.yExtraOption = []
    this.name = '折线/柱状图'
    this.trigger = 'axis'
  }
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

export class PieConfig extends TableConfig {
  data: string[]
  subName : string
  oneRow : boolean
  nameField : string
  valueField : string
  roseType : boolean
  constructor (x:number, y:number) {
    super(x, y)
    this.type = 'pie'
    this.data = []
    this.name = '饼图'
    this.subName = ''
    this.oneRow = false
    this.nameField = ''
    this.valueField = ''
    this.roseType = false
  }
}
export interface ReportConfig {
  id: number
  workspace_id: number
  name: string
  owner: number
  config: {
    dmf: Dmf
    charts: (TableConfig | ChartConfig | PieConfig)[]
  }
}

export interface ReportData {
  chart: TableConfig | ChartConfig | PieConfig
  data: object[]
}

const api = {
  ping (name: string) {
    return axios.get('/ping', { params: { name } })
  },
  login (userinfo: { username: string, password: string }) {
    return axios.post('/login', userinfo)
  },
  reigster (userinfo: {username: string, password :string, nickname:string}) {
    return axios.post('/register', userinfo)
  },
  getStatistics (wrap: {id: number}) {
    return axios.post('/get_user_info', wrap)
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
