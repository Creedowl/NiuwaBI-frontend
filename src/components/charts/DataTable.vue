<template>
  <el-card class="data-table">
    <template #header>
      <div class="card-header">
        <span class="title">{{ config.name }}</span>
        <div v-if="setting.edit">
          <el-popconfirm
            title="确认删除这个图表吗?"
            @confirm="emit('remove')"
          >
            <template #reference>
              <el-button
                type="danger"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
          <el-button

            @click="dialogVisible = true"
          >
            编辑
          </el-button>
        </div>
        <div v-else>
          <el-button
            type="primary"
            plain
            @click="exportToJson"
          >
            导出(JSON)
          </el-button>
          <el-button
            type="primary"
            plain
            @click="exportToCsv"
          >
            导出(CSV)
          </el-button>
          <el-button
            type="primary"
            plain
            @click="exportToXlsx"
          >
            导出(XLSX)
          </el-button>
        </div>
      </div>
    </template>
    <el-table
      v-if="header.length > 0 && data"
      :data="data?.data"
      style="width: 100%"
    >
      <el-table-column
        v-for="item in header"
        :key="item"
        :prop="item"
        :label="labels[item] || item"
      />
    </el-table>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    title="设置"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      label-position="left"
    >
      <el-form-item
        label="类型"
        prop="type"
        required
      >
        <el-input
          v-model="form.type"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="图表类型"
        prop="chart_type"
        required
      >
        <el-select
          v-model="form.chart_type"
          placeholder="请选择图表数据类型"
        >
          <el-option
            label="Sql"
            value="sql"
          />
          <el-option
            label="字段配置"
            value="dmf"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
        required
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item
        v-if="form.chart_type === 'sql'"
        label="Sql"
        prop="sql"
        required
      >
        <el-input
          v-model="form.sql"
          autosize
        />
      </el-form-item>
      <el-form-item
        v-else
        label="字段"
        prop="fields"
        required
      >
        <el-select
          v-model="form.fields"
          multiple
          collapse-tags
          placeholder="选择字段"
        >
          <el-option-group
            key="dimension"
            label="维度"
          >
            <el-option
              v-for="item in dmf_?.dimensions"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            />
          </el-option-group>
          <el-option-group
            key="metric"
            label="指标"
          >
            <el-option
              v-for="item in dmf_?.metrics"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <template v-if="form.chart_type === 'sql'">
        <el-divider>字段映射</el-divider>
        <el-form-item
          v-for="(item, index) in form.kv"
          :key="item.key"
          :label="item.key"
          :prop="`kv.${index}.key`"
          required
        >
          <el-input
            v-model="item.label"
            autosize
          >
            <template #append>
              <el-button
                :icon="Close"
                @click="removeKv(item)"
              />
            </template>
          </el-input>
        </el-form-item>
        <el-popover
          v-model:visible="kvVisible"
          placement="top"
          :width="160"
        >
          <el-form
            ref="kvRef"
            :model="kv"
            label-position="left"
          >
            <el-form-item
              label="Key"
              prop="key"
              required
            >
              <el-input v-model="kv.key" />
            </el-form-item>
            <el-form-item
              label="标签"
              prop="label"
              required
            >
              <el-input v-model="kv.label" />
            </el-form-item>
          </el-form>
          <el-button
            size="mini"
            type="text"
            @click="kvVisible = false"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="addKv()"
          >
            添加
          </el-button>
          <template #reference>
            <el-button type="primary">
              新增
            </el-button>
          </template>
        </el-popover>
      </template>
      <field-filters
        v-else
        :config="config"
        :dmf="dmf"
      />
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Close } from '@element-plus/icons'
import FieldFilters from '../../components/FieldFilters.vue'
import type { Dmf, Kv, ReportData, TableConfig } from '../../api'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'

const props = defineProps<{
  config: TableConfig;
  data: ReportData | null;
  dmf?: Dmf;
  setting: any;
}>()

const form = ref(props.config)
const dmf_ = ref(props.dmf)

const header = ref([] as string[])
const labels = ref({} as any)
const dialogVisible = ref(false)
const kvVisible = ref(false)
const kv = reactive({
  key: '',
  label: ''
})

const emit = defineEmits(['remove'])

onMounted(() => {
  if (props.data && props.data.data.length > 0) {
    for (const key in props.data.data[0]) {
      header.value.push(key)
    }
  }
  if (props.config.kv.length > 0) {
    for (const item of props.config.kv) {
      labels.value[item.key] = item.label
    }
  }
})

function addKv () {
  if (!labels.value[kv.key]) {
    const k = reactive({ ...kv })
    form.value.kv.push(k)
    labels.value[k.key] = k.label
  }
  kvVisible.value = false
}

function removeKv (item: Kv) {
  const index = form.value.kv.indexOf(item)
  if (index !== -1) {
    delete labels.value[item.key]
    form.value.kv.splice(index, 1)
  }
}

function exportToJson () {
  const jsonContent = JSON.stringify(props.data.data)
  SaveTextToFile(jsonContent, props.config.name + '.json')
}

function exportToXlsx () {
  const wb = XLSX.utils.book_new()
  const ws : XLSX.WorkSheet = XLSX.utils.json_to_sheet([])
  const heading : string[] = []
  for (const key in props.data.data[0]) {
    let find = false
    props.config.kv.forEach(kv => {
      if (key === kv.key && !find) {
        heading.push(kv.label)
        find = true
      }
    })
    if (!find) {
      heading.push(key)
    }
  }
  const headingRow = [heading]
  console.log(headingRow)
  XLSX.utils.sheet_add_aoa(ws, headingRow)
  XLSX.utils.sheet_add_json(ws, props.data.data, { origin: 'A2', skipHeader: true })
  XLSX.utils.book_append_sheet(wb, ws, props.config.name)
  XLSX.writeFile(wb, props.config.name + '.xlsx', {
    Props: {
      Author: 'NiuWaBI'
    }
  })
}

function exportToCsv () {
  if (props.data.data === null || props.data.data.length === 0 || props.data.data === undefined) {
    ElMessage.error('无法导出，数据异常')
    return
  }
  const keys : string[] = []
  const vals : string[] = []
  for (const key in props.data.data[0]) {
    keys.push(key)
    let find = false
    props.config.kv.forEach(kv => {
      if (key === kv.key && !find) {
        vals.push(kv.label)
        find = true
      }
    })
    if (!find) {
      vals.push(key)
    }
  }
  let csvContent = vals.join(',') + '\n'
  for (const obj of props.data.data) {
    let first = true
    Object.entries(obj).forEach(
      ([key, value]) => {
        if (keys.indexOf(key) > -1) {
          if (first) {
            first = false
          } else {
            csvContent += ','
          }
          csvContent += value.toString()
        }
      })
    csvContent += '\n'
  }
  SaveTextToFile(csvContent, props.config.name + '.csv')
}

function SaveTextToFile (content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    // In case of IE 10+
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

</script>

<style scoped>
.data-table {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.title {
  font-size: large;
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
</style>
