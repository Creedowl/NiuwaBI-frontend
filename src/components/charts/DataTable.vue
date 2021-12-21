<template>
  <el-card class="data-table">
    <template #header>
      <div class="card-header">
        <span class="title">{{ config.name }}</span>
        <el-button
          v-if="setting.edit"
          @click="dialogVisible = true"
        >
          编辑
        </el-button>
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
      v-if="header.length > 0"
      :data="data.data"
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
        label="名称"
        prop="name"
        required
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item
        label="Sql"
        prop="sql"
        required
      >
        <el-input
          v-model="form.sql"
          autosize
        />
      </el-form-item>
      <el-divider />
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
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Close, Eleme } from '@element-plus/icons'
import { Kv, ReportData, TableConfig } from '../../api'
import { ElMessage } from 'element-plus'
import { SetOperationEnum } from 'element-plus/es/components/tree-v2/src/virtual-tree'
import * as XLSX from 'xlsx'

const props = defineProps<{
  config: TableConfig;
  data: ReportData;
  setting: any;
}>()

const form = ref(props.config)

const header = ref([] as string[])
const labels = ref({} as any)
const dialogVisible = ref(false)
const kvVisible = ref(false)
const kv = reactive({
  key: '',
  label: ''
})

onMounted(() => {
  if (props.data.data.length > 0) {
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
