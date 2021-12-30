<template>
  <div id="report">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="'/workspace'">
        工作区列表
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="`/workspace/${path.workspace.id}`">
        {{ path.workspace.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="`/report/${path.report.id}`">
        {{ path.report.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div
      v-if="!loading"
      id="grid"
    >
      <div id="operations">
        <template v-if="!setting.edit">
          <el-button
            type="primary"
            @click="setting.edit = true"
          >
            编辑
          </el-button>
        </template>
        <template v-else>
          <el-dropdown
            style="padding-right: 10px"
            @command="addChart"
          >
            <el-button type="primary">
              新增图表
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="table">
                  表格
                </el-dropdown-item>
                <el-dropdown-item command="line">
                  折线图
                </el-dropdown-item>
                <el-dropdown-item command="pie">
                  饼图
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            type="primary"
            @click="setttingVisible = true"
          >
            配置
          </el-button>
          <el-button
            type="success"
            @click="save()"
          >
            保存
          </el-button>
          <el-button
            type="warning"
            @click="setting.edit = false"
          >
            取消
          </el-button>
        </template>
      </div>
      <div class="title">
        {{ config.name }}
      </div>
      <grid-layout
        v-if="layout.length > 0"
        :key="updateKey"
        v-model:layout="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="setting.edit"
        :is-resizable="setting.edit"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        class="grid"
      >
        <grid-item
          v-for="(item, index) in config?.config.charts"
          :key="item.pos.i"
          :x="item.pos.x"
          :y="item.pos.y"
          :w="item.pos.w"
          :h="item.pos.h"
          :i="item.pos.i"
          style="box-sizing: border-box"
        >
          <el-card
            :v-loading="chartData.length > 0"
            class="chart"
            :body-style="{ padding: '0', height: '100%' }"
          >
            <data-table
              v-if="item.type === 'table'"
              :config="item"
              :data="chartData[index] || null"
              :dmf="config.config.dmf"
              :setting="setting"
              @remove="removeChart"
            />
            <data-chart
              v-if="item.type === 'line'"
              :config="(item as any)"
              :data="chartData[index] || null"
              :dmf="config.config.dmf"
              :setting="setting"
              @remove="removeChart"
            />
            <pie-chart
              v-if="item.type === 'pie'"
              :config="(item as any)"
              :data="chartData[index] || null"
              :dmf="config.config.dmf"
              :setting="setting"
              @remove="removeChart"
            />
          </el-card>
        </grid-item>
      </grid-layout>
      <el-empty
        v-else
        description="报表为空"
      />
    </div>
    <el-skeleton
      v-else
      :rows="5"
      animated
    />
    <el-dialog
      v-model="setttingVisible"
      title="报表配置"
      :destroy-on-close="true"
    >
      <el-form
        :model="config"
        label-width="auto"
        label-position="left"
      >
        <el-form-item
          label="名称"
          prop="name"
          required
        >
          <el-input
            v-model="config.name"
          />
        </el-form-item>
        <el-form-item
          label="表名"
          prop="config.dmf.table"
          required
        >
          <el-input
            v-model="config.config.dmf.table"
          />
        </el-form-item>
        <el-divider>维度</el-divider>
        <el-form-item
          v-for="(item, index) in config.config.dmf.dimensions"
          :key="index"
          :label="`维度${index}`"
          required
        >
          <el-form-item
            :prop="`config.dmf.dimensions.${index}.type`"
            label="维度类型"
            required
          >
            <div class="oneline">
              <el-select
                v-model="item.type"
                placeholder="请选择维度类型"
              >
                <el-option
                  label="普通维度"
                  value="dimension"
                />
                <el-option
                  label="计算维度"
                  value="equation_dimension"
                />
              </el-select>
              <el-popconfirm
                title="确认删除这个维度吗?"
                @confirm="removeDimension(index)"
              >
                <template #reference>
                  <el-button
                    style="margin-left:5px"
                    type="warning"
                    size="mini"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-form-item>
          <el-form-item
            :prop="`config.dmf.dimensions.${index}.name`"
            label="字段名"
            required
          >
            <el-input
              v-model="item.name"
            />
          </el-form-item>
          <el-form-item
            :prop="`config.dmf.dimensions.${index}.label`"
            label="标签"
            required
          >
            <el-input
              v-model="item.label"
            />
          </el-form-item>
          <template v-if="item.type === 'dimension'">
            <el-form-item
              :prop="`config.dmf.dimensions.${index}.field`"
              label="字段"
              required
            >
              <el-input
                v-model="getDimension(item).field"
              />
            </el-form-item>
          </template>
          <template v-else-if="item.type === 'equation_dimension'">
            <el-form-item
              :prop="`config.dmf.dimensions.${index}.formula`"
              label="公式"
              required
            >
              <el-input
                v-model="getEquationDimension(item).formula"
              />
            </el-form-item>
            <el-form-item
              label="元素"
              required
            >
              <el-form-item
                v-for="(elem, i) in getEquationDimension(item).elements"
                :key="i"
                :label="`元素${i}`"
                required
              >
                <el-input
                  v-model="getEquationDimension(item).elements[i]"
                >
                  <template #append>
                    <el-button
                      :icon="Close"
                      @click="removeElement('equation_dimension', index, i)"
                    />
                  </template>
                </el-input>
              </el-form-item>
              <el-button
                type="primary"
                size="mini"
                @click="addElement('equation_dimension', index)"
              >
                新增
              </el-button>
            </el-form-item>
          </template>
        </el-form-item>
        <el-button
          type="success"
          @click="addDimension()"
        >
          新增维度
        </el-button>
        <el-divider>指标</el-divider>
        <el-form-item
          v-for="(item, index) in config.config.dmf.metrics"
          :key="index"
          :label="`指标${index}`"
          required
        >
          <el-form-item
            :prop="`config.dmf.metrics.${index}.type`"
            label="指标类型"
            required
          >
            <div class="oneline">
              <el-select
                v-model="item.type"
                placeholder="请选择指标类型"
              >
                <el-option
                  label="普通指标"
                  value="metric"
                />
                <el-option
                  label="计算指标"
                  value="equation_metric"
                />
              </el-select>
              <el-popconfirm
                title="确认删除这个指标吗?"
                @confirm="removeMetric(index)"
              >
                <template #reference>
                  <el-button
                    style="margin-left:5px"
                    type="warning"
                    size="mini"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-form-item>
          <el-form-item
            :prop="`config.dmf.metrics.${index}.name`"
            label="字段名"
            required
          >
            <el-input
              v-model="item.name"
            />
          </el-form-item>
          <el-form-item
            :prop="`config.dmf.metrics.${index}.label`"
            label="标签"
            required
          >
            <el-input
              v-model="item.label"
            />
          </el-form-item>
          <template v-if="item.type === 'metric'">
            <el-form-item
              :prop="`config.dmf.metrics.${index}.field`"
              label="字段"
              required
            >
              <el-input
                v-model="getMetric(item).field"
              />
            </el-form-item>
            <el-form-item
              :prop="`config.dmf.metrics.${index}.aggr`"
              label="聚合函数"
              required
            >
              <el-input
                v-model="getMetric(item).aggr"
              />
            </el-form-item>
          </template>
          <template v-else-if="item.type === 'equation_metric'">
            <el-form-item
              :prop="`config.dmf.metrics.${index}.formula`"
              label="公式"
              required
            >
              <el-input
                v-model="getEquationMetric(item).formula"
              />
            </el-form-item>
            <el-form-item
              label="元素"
              required
            >
              <el-form-item
                v-for="(elem, i) in getEquationMetric(item).elements"
                :key="i"
                :label="`元素${i}`"
                required
              >
                <el-input
                  v-model="getEquationMetric(item).elements[i]"
                >
                  <template #append>
                    <el-button
                      :icon="Close"
                      @click="removeElement('equation_metric', index, i)"
                    />
                  </template>
                </el-input>
              </el-form-item>
              <el-button
                plain
                type="primary"
                style="float: left"
                size="mini"
                @click="addElement('equation_metric', index)"
              >
                新增
              </el-button>
            </el-form-item>
          </template>
        </el-form-item>
        <el-button
          type="success"
          @click="addMetric()"
        >
          新增指标
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import { ElMessage } from 'element-plus'
import { Close, ArrowDown } from '@element-plus/icons'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import api, { ChartConfig, dimension, equation_dimension, equation_metric, metric, PieConfig, Pos, ReportConfig, ReportData, TableConfig } from '../../api'
import DataTable from '../../components/charts/DataTable.vue'
import DataChart from '../../components/charts/DataChart.vue'
import PieChart from '../../components/charts/PieChart.vue'

const reportID = parseInt(useRoute().params.id as string)
const config = ref({} as ReportConfig)
const chartData = ref<ReportData[]>([])
const setting = reactive({
  edit: false
})
const loading = ref(true)
const setttingVisible = ref(false)
const updateKey = ref(0)

const layout = ref([] as Pos[])
const path = getCurrentInstance()?.proxy?.$Path

async function getData () {
  try {
    const { data } = await api.report.get(reportID)
    config.value = data.data as ReportConfig
    if (config.value.config.charts === null) {
      config.value.config.charts = []
    }
    if (config.value.config.dmf.dimensions === null) {
      config.value.config.dmf.dimensions = []
    }
    if (config.value.config.dmf.metrics === null) {
      config.value.config.dmf.metrics = []
    }
    layout.value = []
    for (const i of config.value.config.charts) {
      layout.value.push(i.pos)
    }
    if (config.value.config.charts.length > 0) {
      const resp = await api.report.execute(reportID)
      chartData.value = resp.data.data
    }
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}

async function save () {
  try {
    await api.report.update(config.value as ReportConfig)
    ElMessage.success('更新成功')
    setting.edit = false
    await getData()
    updateKey.value += 1
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  }
}

onMounted(getData)

function addDimension () {
  config.value.config.dmf.dimensions.push({
    type: 'dimension',
    name: '',
    label: '',
    field: ''
  })
}

function removeDimension (index: number) {
  config.value.config.dmf.dimensions.splice(index, 1)
}

function addMetric () {
  config.value.config.dmf.metrics.push({
    type: 'metric',
    name: '',
    label: '',
    field: '',
    aggr: ''
  })
}

function removeMetric (index: number) {
  config.value.config.dmf.metrics.splice(index, 1)
}

// f**k these shit

function getDimension (dim: dimension | equation_dimension) {
  return dim as dimension
}

function getEquationDimension (dim: dimension | equation_dimension) {
  return dim as equation_dimension
}

function getMetric (met: metric | equation_metric) {
  return met as metric
}

function getEquationMetric (met: metric | equation_metric) {
  return met as equation_metric
}

function addElement (type: string, index: number) {
  if (type === 'equation_dimension') {
    const elements = (config.value.config.dmf.dimensions[index] as equation_dimension).elements
    if (elements === undefined) {
      (config.value.config.dmf.dimensions[index] as equation_dimension).elements = []
    }
    (config.value.config.dmf.dimensions[index] as equation_dimension).elements.push('')
  } else if (type === 'equation_metric') {
    const elements = (config.value.config.dmf.metrics[index] as equation_metric).elements
    if (elements === undefined) {
      (config.value.config.dmf.metrics[index] as equation_metric).elements = []
    }
    (config.value.config.dmf.metrics[index] as equation_metric).elements.push('')
  }
}

function removeElement (type: string, index: number, i: number) {
  if (type === 'equation_dimension') {
    (config.value.config.dmf.dimensions[index] as equation_dimension).elements.splice(i, 1)
  } else if (type === 'equation_metric') {
    (config.value.config.dmf.metrics[index] as equation_metric).elements.splice(i, 1)
  }
}

function addChart (type: string) {
  switch (type) {
    case 'table': {
      const t = ref(new TableConfig((layout.value.length * 2) % 12, layout.value.length + 12))
      config.value.config.charts.push(t.value)
      layout.value.push(t.value.pos)
      break
    }
    case 'line': {
      const t = ref(new ChartConfig((layout.value.length * 2) % 12, layout.value.length + 12))
      config.value.config.charts.push(t.value)
      layout.value.push(t.value.pos)
      break
    }
    case 'pie': {
      const t = ref(new PieConfig((layout.value.length * 2) % 12, layout.value.length + 12))
      config.value.config.charts.push(t.value)
      layout.value.push(t.value.pos)
      break
    }
    default: {
      ElMessage.error(`图表类型 ${type} 不存在`)
      return
    }
  }
  ElMessage.success('新建成功')
}

function removeChart (val: string) {
  const index = layout.value.map(item => item.i).indexOf(val)
  if (index === -1) {
    ElMessage.error('数据错误，无法删除')
    return
  }
  ElMessage.success('删除报表' + index + '成功')
  layout.value.splice(index, 1)
  config.value.config.charts.splice(index, 1)
}
</script>

<style scoped>
#report {
  width: 80%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}

.grid {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#operations {
  display: flex;
  justify-content: right;
  margin-bottom: 20px;
}

.title {
  font-size: large;
  font-weight: bold;
  margin: 20px;
}

.oneline {
  display: flex;
  float: left;
  justify-content: space-evenly;
}
</style>
