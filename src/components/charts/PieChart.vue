<template>
  <el-card
    class="chart-table"
    :body-style="{height: 'calc(100% - 120px)', padding: '20px'}"
  >
    <template #header>
      <div class="card-header">
        <span class="title">{{ config.name }}</span>
        <el-button
          v-if="setting.edit"
          @click="dialogVisible = true"
        >
          编辑
        </el-button>
      </div>
    </template>
    <div
      ref="myChart"
      :style="{ width: '100%', height: '100%' }"
    />
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
        label="副标题"
        prop="subName"
        required
      >
        <el-input v-model="form.subName" />
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
        label="玫瑰图"
        prop="roseType"
      >
        <el-switch
          v-model="form.roseType"
          active-text="启用"
          inactive-text="弃用"
        />
      </el-form-item>
      <el-form-item
        label="数据格式"
        prop="oneRow"
        required
      >
        <el-switch
          v-model="form.oneRow"
          active-text="单行"
          inactive-text="双列"
        />
      </el-form-item>

      <!-- KV BEGIN -->
      <template v-if="form.oneRow === true">
        <h4>KV字段配置</h4>
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
        <el-divider />
      </template>

      <template v-if="form.oneRow === true">
        <h4>单列数据配置</h4>
        <el-form-item
          v-for="(item,index) in form.data"
          :key="item"
          :label="item"
          :prop="form.data[index]"
        >
          <el-input
            v-model="form.data[index]"
            disabled
          />
        </el-form-item>
        <el-popover
          v-model:visible="yCreationVisible"
          placement="top"
          :width="200"
        >
          <el-form
            :model="yCreation"
            label-position="left"
          >
            <el-form-item
              label="Key"
              :prop="yCreation.key"
            >
              <el-input v-model="yCreation.key" />
            </el-form-item>
            <el-button
              size="mini"
              type="text"
              @click="yCreationVisible=false"
            >
              取消
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="addData()"
            >
              添加
            </el-button>
          </el-form>
          <template #reference>
            <el-button type="primary">
              新增
            </el-button>
          </template>
        </el-popover>
      </template>
      <!-- KV END -->
      <template v-if="form.oneRow === false">
        <el-form-item
          label="名字字段"
          prop="nameField"
          required
        >
          <el-input v-model="form.nameField" />
        </el-form-item>
        <el-form-item
          label="数值字段"
          prop="valueField"
          required
        >
          <el-input v-model="form.valueField" />
        </el-form-item>
      </template>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, reactive } from 'vue'
import * as echarts from 'echarts'
import type{ Dmf, ReportData, PieConfig, Kv } from '../../api'
import { Close } from '@element-plus/icons'

const props = defineProps<{
  config: PieConfig;
  data: ReportData;
  setting: any;
  dmf? : Dmf;
}>()
const kvVisible = ref(false)
const dialogVisible = ref(false)
const form = ref(props.config)
const myChart = shallowRef<HTMLElement>()
const myCharts = shallowRef<any>()
const header = ref([] as string[])
const labels = ref({} as any)
const kv = reactive({
  key: '',
  label: ''
})
const yCreationVisible = ref(false)
const yCreation = reactive({
  key: ''
})

function addData () {
  if (yCreation.key !== '') {
    form.value.data.push(yCreation.key)
  }
}

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
  // 绘制图表
  // FIXME
  setTimeout(() => {
    myCharts.value = echarts.init(myChart.value!)
    myCharts.value.setOption(props.data.data)
  }, 1000)
})

</script>

<style scoped>
.chart-table {
  width: 100%;
  min-height: 100%;
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
