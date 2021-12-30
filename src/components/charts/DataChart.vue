<template>
  <el-card
    class="chart-table"
    :body-style="{height: 'calc(100% - 120px)', padding: '20px'}"
  >
    <template #header>
      <div class="card-header">
        <span class="title">{{ config.name }}</span>
        <div v-if="setting.edit">
          <el-popconfirm
            title="确认删除这个图表吗?"
            @confirm="emit('remove',form.pos.i)"
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
            v-if="setting.edit"
            @click="dialogVisible = true"
          >
            编辑
          </el-button>
        </div>
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

      <el-divider />
      <template v-if="form.chart_type === 'sql'">
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
      <el-divider />
      <h3>
        图表字段配置
      </h3>
      <el-form-item
        label="图表名称"
        prop="name"
        required
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item
        label="x轴字段"
        prop="x"
        required
      >
        <el-input v-model="form.x" />
      </el-form-item>
      <el-form-item
        prop="trigger"
        label="Trigger"
      >
        <el-select v-model="form.trigger">
          <el-option
            v-for="item2 in triggerOptions"
            :key="item2"
            :label="item2"
            :value="item2"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="x轴类型"
        prop="xAxisType"
        required
      >
        <el-input v-model="form.xAxisType" />
      </el-form-item>
      <el-form-item
        label="y轴类型"
        prop="yDataType"
        required
      >
        <el-input v-model="form.yDataType" />
      </el-form-item>
      <!-- Yaxis Datas-->
      <h3>展示数据配置(Y轴)</h3>
      <!-- FIXME -->
      <el-form-item
        v-for="(item,index) in form.y"
        :key="item"
        :label="item"
        :prop="form.datatype[index]"
      >
        <!-- <el-input
          v-model="form.datatype[index]"
          autosize
        /> -->
        <el-select
          v-model="form.datatype[index]"
          placeholder="必选！"
        >
          <el-option
            v-for="item2 in graphOptions"
            :key="item2"
            :label="item2"
            :value="item2"
          />
        </el-select>

        <el-button
          :icon="Close"
          @click="removeY(index)"
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
            prop="key"
            required
          >
            <el-input
              v-model="yCreation.key"
            />
          </el-form-item>
          <el-form-item
            label="Type"
            required
          >
            <el-select
              v-model="yCreation.type"
              placeholder="必选"
            >
              <el-option
                v-for="item2 in graphOptions"
                :key="item2"
                :label="item2"
                :value="item2"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="平滑"
            prop="smooth"
            required
          >
            <el-switch
              v-model="yCreation.smooth"
              active-text="开"
              inactive-text="关"
            />
          </el-form-item>
          <el-button
            size="mini"
            type="text"
            @click="yCreationVisible = false"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="addY()"
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
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, reactive, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { Dmf, ChartConfig, Kv, ReportData } from '../../api'
import { Close } from '@element-plus/icons'

const graphOptions = [
  'line', 'bar'
]

const triggerOptions = [
  'item', 'axis'
]

const props = defineProps<{
  config: ChartConfig;
  data: ReportData;
  setting: any;
  dmf?: Dmf;
}>()

const form = ref(props.config)
const myChart = shallowRef<HTMLElement>() // 也可以用const myChart = ref<any>();
const myCharts = shallowRef<any>()
const dmf_ = ref(props.dmf)

const emit = defineEmits(['remove'])

const header = ref([] as string[])
const labels = ref({} as any)
const dialogVisible = ref(false)
const kvVisible = ref(false)
const kv = reactive({
  key: '',
  label: ''
})
const yCreationVisible = ref(false)
const yCreation = reactive({
  key: '',
  type: 'line',
  smooth: false
})

function removeY (index: number) {
  form.value.y.splice(index, 1)
  form.value.datatype.splice(index, 1)
}

function addKv () {
  if (!labels.value[kv.key]) {
    const k = reactive({ ...kv })
    form.value.kv.push(k)
    labels.value[k.key] = k.label
  }
  kvVisible.value = false
}

function addY () {
  form.value.y.push(yCreation.key)
  form.value.datatype.push(yCreation.type)
  form.value.yExtraOption.push({ smooth: true })
  yCreationVisible.value = false
}

function removeKv (item: Kv) {
  const index = form.value.kv.indexOf(item)
  if (index !== -1) {
    delete labels.value[item.key]
    form.value.kv.splice(index, 1)
  }
}

onMounted(() => {
  if (props.data && props.data.data.length > 0) {
    for (const key in props.data.data[0]) {
      header.value.push(key)
    }
  }
  if (props.data && props.config.kv.length > 0) {
    for (const item of props.config.kv) {
      labels.value[item.key] = item.label
    }
  }
  // 绘制图表
  // FIXME
  if (props.data) {
    setTimeout(() => {
      myCharts.value = echarts.init(myChart.value!)
      myCharts.value.setOption(props.data.data)
    }, 1000)
  }
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
