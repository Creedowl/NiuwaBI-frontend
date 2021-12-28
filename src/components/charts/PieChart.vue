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
  <el-dialog />
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import * as echarts from 'echarts'
import type{ TableConfig, ReportData, PieConfig } from '../../api'

const props = defineProps<{
  config: PieConfig;
  data: ReportData;
  setting: any;
}>()

const dialogVisible = ref(false)
const form = ref(props.config)
const myChart = shallowRef<HTMLElement>()
const myCharts = shallowRef<any>()
const header = ref([] as string[])
const labels = ref({} as any)

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
  myCharts.value = echarts.init(myChart.value!)
  myCharts.value.setOption(props.data.data)
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
