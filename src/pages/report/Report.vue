<template>
  <div id="report">
    <div
      v-if="config"
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
              v-if="item.type === 'table' && chartData.length > 0"
              :config="item"
              :data="chartData[index]"
              :setting="setting"
            />
            <data-chart
              v-if="item.type === 'line' && chartData.length > 0"
              :config="item"
              :data="chartData[index]"
              :setting="setting"
            />
          </el-card>
        </grid-item>
      </grid-layout>
    </div>
    <el-skeleton
      v-else
      :rows="5"
      animated
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { Pos, ReportConfig, ReportData } from '../../api'
import DataTable from '../../components/charts/DataTable.vue'
import DataChart from '../../components/charts/DataChart.vue'

const reportID = parseInt(useRoute().params.id as string)
const config = ref<ReportConfig>()
const chartData = ref<ReportData[]>([])
const setting = reactive({
  edit: true
})
const router = useRouter()

const layout = ref([] as Pos[])

async function getData () {
  try {
    const { data } = await api.report.get(reportID)
    config.value = data.data as ReportConfig
    for (const i of config.value?.config.charts) {
      layout.value.push(i.pos)
    }
    const resp = await api.report.execute(reportID)
    chartData.value = resp.data.data
  } catch (error) {
    console.error(error)
    router.back()
  }
}

async function save () {
  try {
    await api.report.update(config.value as ReportConfig)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  }
}

onMounted(getData)
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
</style>
